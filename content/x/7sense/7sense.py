#!/usr/bin/env python
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
# 
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
# 
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.


from BeautifulSoup import BeautifulSoup
import re
import os
import cssutils

class HtmlParser:
    
    def __init__(self, filePath):
        self.file = open(filePath, 'r')
        self.soup = BeautifulSoup(self.file)

    def getReferencedIds(self):
        elementsWithId = self.soup.findAll(attrs={'id': re.compile('.*')})
        return set([element.get('id') for element in elementsWithId])
    
    def getReferencedClasses(self):
        allClasses = []
        elementsWithClass = self.soup.findAll(attrs={'class': re.compile('.*')})
        classLists = [element.get('class') for element in elementsWithClass]
        for classList in classLists:
            classes = classList.split(' ')
            allClasses.extend(classes)
            
        return set(allClasses)
        
    def getReferencedStyleSheets(self):
        pass
        
    def getInlineStyleSheets(self):
        return [style.contents[0] for style in self.soup.findAll('style') if style.contents]
        
class CssParser:
    
    def __init__(self, filePath=None, string=None):
        if filePath:
            self.css = cssutils.parseFile(filePath)
        elif string:
            self.css = cssutils.parseString(string)
            
        rules = self.css.cssRules
        selectors = []
        for rule in rules:
            if not hasattr(rule, 'selectorList'):
                continue
            for selector in rule.selectorList:
                selectorText = selector.selectorText
                selectorComponents = selectorText.split(' ')
                selectors.extend(selectorComponents)
                
        self.selectors = selectors
        
    def getDefinedIds(self):
        return set([selector[1:] for selector in self.selectors if re.compile('#.*').match(selector)])
        
    def getDefinedClasses(self):
        return set([selector[selector.find('.') + 1:] for selector in self.selectors if re.compile('.*\..*').match(selector)])
        
class ColeSear:
    
    def __init__(self, rootPathes, excludeDirs=[]):
        self.rootPathes = rootPathes
        self.excludeDirs = excludeDirs
        
        self.definedIds = set()
        self.definedClasses = set()
        self.referencedIds = set()
        self.referencedClasses = set()
        
    def walkDirectory(self):
        for rootPath in self.rootPathes:
            # os.walk doesn't include the rootPath
            self.processCssOrHtmlFile(rootPath)
            for path, dirs, files in os.walk(rootPath):
                allFiles = [os.path.abspath(os.path.join(path, filename)) for filename in files]
                for fileName in allFiles:
                    self.processCssOrHtmlFile(fileName)
            
        
    def processCssOrHtmlFile(self, fileName):
        if fileName.endswith('.css'):
            cp = CssParser(fileName)
            self.definedIds = self.definedIds.union(cp.getDefinedIds())
            self.definedClasses = self.definedClasses.union(cp.getDefinedClasses())
        if fileName.endswith('.html') or fileName.endswith('.htm'):
            p = HtmlParser(fileName)
            self.referencedIds = self.referencedIds.union(p.getReferencedIds())
            self.referencedClasses = self.referencedClasses.union(p.getReferencedClasses())
            
            # Don't forget about inline styles!
            for styleString in p.getInlineStyleSheets():
                cp = CssParser(string=styleString)
                self.definedIds = self.definedIds.union(cp.getDefinedIds())
                self.definedClasses = self.definedClasses.union(cp.getDefinedClasses())
                
    
    def seeDeadStyles(self):
        self.walkDirectory()
        params = {
            'unusedIds': '\n'.join(self.definedIds - self.referencedIds),
            'unusedClasses': '\n'.join(self.definedClasses - self.referencedClasses),
            'undefinedIds': '\n'.join(self.referencedIds - self.definedIds),
            'undefinedClasses': '\n'.join(self.referencedClasses - self.definedClasses)
        }
        
        return """
DEAD CODE REPORT
================

Undefined IDs
------------- 
%(undefinedIds)s\n
Undefined Classes
-----------------
%(undefinedClasses)s\n
Unused IDs
----------
%(unusedIds)s\n
Unused Classes
--------------
%(unusedClasses)s\n
""" % params
        
if __name__ == '__main__':
    import sys
    if len(sys.argv) < 2:
        print 'usage: %s /webroot/css /webroot/html ...' % sys.argv[0]
        sys.exit(1)
        
    seeker = ColeSear(sys.argv[1:])
    print seeker.seeDeadStyles()
    