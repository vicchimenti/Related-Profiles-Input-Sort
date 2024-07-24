/* 
    Related Profiles Input Sort
    v10/text/html

    Programmable Layout that reads in related profiles as JSON then sorts based on the nameSort node

    This was converted to a PL to allow srting by a custom node which cannot be done through a keyword search navigation
*/
try {
    let FullListOutputImports = JavaImporter(
        com.terminalfour.publish.utils.TreeTraversalUtils,
        com.terminalfour.spring.ApplicationContextProvider,
        com.terminalfour.content.IContentManager,
        com.terminalfour.version.Version,
        com.terminalfour.publish.utils.BrokerUtils,
        com.terminalfour.sitemanager.cache.CachedContent
    );
    with (FullListOutputImports) {

        function processTags(t4Tag) {
            myContent = content || null;
            return String(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, myContent, language, isPreview, t4Tag));
        }

        function processNavObj(t4Tag) {
            myContent = content || null;
            return (com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, myContent, language, isPreview, t4Tag));
        }

        function processT4Tags(t4tag, contentID, sectionID, forMediaFile) {
            let cachedContent = content || null;
            let cachedSection = section;
            if (typeof sectionID !== 'undefined' && sectionID !== null && Number(sectionID) > 0) {
                cachedSection = getCachedSectionFromId(sectionID);
            }
            if (contentID === null && sectionID !== null) {
                cachedContent = null;
            } else if (typeof contentID !== 'undefined' && Number(contentID) > 0) {
                cachedContent = getCachedContentFromId(contentID);
                if (cachedContent == null) {
                    throw 'Could not get cachedContent';
                }
            }
            if (cachedSection == null) {
                throw 'Could not get cachedSection';
            }
            if (forMediaFile !== true) {
                forMediaFile = false;
            }
            let renderedHtml = String(BrokerUtils.processT4Tags(dbStatement, publishCache, cachedSection, cachedContent, language, isPreview, t4tag));
            if (forMediaFile) {
                renderedHtml = renderedHtml.replace(/&/gi, '&amp;');
            }
            return renderedHtml;
        }

        log = message => document.write('<script>eval("console.log(\'' + message + '\')");</script>');


        // variables
        let profilesNav = '<t4 type="navigation" name="Related Profiles Input Sort Keyword Search" id="1064" />',
        profiles, profilesOutput, output = '';

        let relatedNavObj = processTags('<t4 type="navigation" name="Related Profiles Input Sort Keyword Search" id="1064" />');
        
        // log('relatedNavObj: ' + relatedNavObj);

        // log('relatedNavObj: ' + typeof relatedNavObj);

        let relatedNavObjArray = (relatedNavObj) ? relatedNavObj.split('{') : null;

        log('relatedNavObjArray: ' + relatedNavObjArray);

        let len = relatedNavObjArray.length;

        log('len: ' + len);


        // for (let i = 0; i < len; i++) {
        //     log(relatedNavObjArray[i]);
        // }

        let sortRequest = processTags('<t4 type="content" name="Sort Order" output="normal" modifiers="striptags,htmlentities" />');

        log('sortRequest: ' + sortRequest);

        log('sortRequest: ' + typeof sortRequest);

        let selectedRequestArray = (sortRequest) ? sortRequest.split(',') : null;

        let sortLen = selectedRequestArray.length;

        log('selectedRequestArray: ' + selectedRequestArray);

        log('sortLen: ' + sortLen);


        // const priorityList = ["apple", "banana", "orange"];

        // const fruits = ["orange", "banana", "grape", "apple"];

        // relatedNavObjArray.sort((a, b) => {
        // const indexA = selectedRequestArray.indexOf(a);
        // const indexB = selectedRequestArray.indexOf(b);

        // // If an item is not in the priority list, put it at the end
        // if (indexA === -1) return 1;
        // if (indexB === -1) return -1;

        // return indexA - indexB;
        // });

        // log('sorted relatedNavObjArray: ' + relatedNavObjArray);

        // let selectedValue = content.get('UserID Search').publish();

        // log('selectedValue: ' + selectedValue);

        // let selectedValueArray = (selectedValue) ? selectedValue.split('OR') : null;

        // log('selectedValueArray: ' + selectedValueArray);


        // for (let i = 0; i < relatedNavObjArray.length; i++) {
        //     for (request in selectedRequestArray) {
        //         if (relatedNavObjArray[i].includes(request)) {
        //             log('true: ' + relatedNavObjArray[i] + " : " + request);
        //         } {
        //             log('false: ' + relatedNavObjArray[i] + " : " + request);
        //         }

        //     }
        // }

        // relatedNavObjArray.array.forEach(element => {
        //     sortRequest.array.forEach(request => {
        //         if (element.includes(request)) {
        //             log('true: ' + request);
        //         } {
        //             log('false: ' + request);
        //         }

        //     });
        // });

        // for (let element of relatedNavObjArray) {
            
        // }


        // let relatedNavObjObject = JSON.parse(relatedNavObj, reviver);

        // log('hello');

        // log('relatedNavObjObject:' + relatedNavObjObject);

        // log('relatedNavObj Values: ' + Object.values(relatedNavObj));

        // log('relatedNavObj Keys: ' + Object.keys(relatedNavObj));



        // let relatedNavObjTest = processNavObj('<t4 type="navigation" name="Related Profiles Input Sort Keyword Search" id="1064" />');

        // log('relatedNavObjTest: ' + relatedNavObjTest);

        // log('relatedNavObjTest: ' + typeof relatedNavObjTest);

        // let newMap = new Map (processNavObj('<t4 type="navigation" name="Related Profiles Input Sort Keyword Search" id="1064" />'));

        // let relatedNavObjTestMap = new Map(relatedNavObjTest);

        // log(relatedNavObjTestMap.get("userId"));

        // log('relatedNavObjTest: ' + JSON.stringify(relatedNavObjTest));




        // let relatedNavObjTestObject = JSON.parse(relatedNavObjTest);

        // log('Hello');

        // log('relatedNavObjTestObject' + relatedNavObjTestObject);

        // log('relatedNavOBJTest Entries:' + Object.entries(relatedNavObjTest));

        // log('relatedNavOBJTest Keys:' + Object.keys(relatedNavObjTest));


        // let publishObj = com.terminalfour.content.element.KeywordSearchContentElement.publish('<t4 type="navigation" name="Related Profiles Input Sort Keyword Search" id="1064" />')

        // log('publishObj: ' + publishObj);

        // let valueObj = getValue('<t4 type="navigation" name="Related Profiles Input Sort Keyword Search" id="1064" />')

        // log('valueObj: ' + valueObj);

        // let relatedNavObjUserIdDot = profilesNav[0].userId;

        // log('relatedNavObjUserIdDot: ' + relatedNavObjUserIdDot);

        // let relatedNavObjUserBracket = String(relatedNavObj[userId]);

        // log('relatedNavObjUserBracket: ' + relatedNavObjUserBracket);

        // let relatedArray = eval('[' + processT4Tags(profilesNav).replace(/,\s*$/, "") + ']');

        // log('relatedArray: ' + relatedArray);

        // log('relatedArray: ' + typeof relatedArray);

        // log('relatedArray stringify: ' + JSON.stringify(relatedArray));

        // for (let [key, value] of Object.entries(relatedArray)) {
        //     log(`${key}: ${value}`);
        // }

        // Object.entries(relatedArray).forEach(([key, value]) => {
        //     log(`${key} ${value}`);
        // })

        // log('relatedArray parse:' + JSON.parse(relatedArray));






        // let requestArray = (sortRequest) ? sortRequest.split(',') : null;

        // log('requestArray: ' + requestArray);




        // Bubble Sort

        // 'userId'

        // defining main functions
        function sortByName( el1, el2 ) {
            let a = el1.nameSort;
            let b = el2.nameSort;
            return (a < b) ? -1 : (a > b) ? 1 : 0;
        }

        function getCachedSectionFromId(sectionID) {
            if (typeof sectionID === 'undefined') {
                return section
            } else if (section.getID() == sectionID) {
                return section
            }
            sectionID = Number(sectionID)
            if (sectionID == 0) {
                throw 'Passed Incorrect Section ID to getCachedSectionFromId'
            }
            return TreeTraversalUtils.findSection(
                publishCache.getChannel(),
                section,
                sectionID,
                language
            )
        }

        function getContentManager() {
            return ApplicationContextProvider.getBean(
                IContentManager
            )
        }

        function getCachedContentFromId(contentID, contentVersion) {
            if (typeof contentID === 'undefined' && typeof contentVersion === 'undefined') {
                return content
            } else if (Number(contentID) <= 0 && typeof contentVersion !== 'undefined' && content !== null) {
                contentID = content.getID();
            } else {
                contentID = Number(contentID);
            }
            if (content === null && contentID === 0) {
                throw 'Passed Incorrect Content ID to getContentFromId'
            }
            let contentManager = getContentManager();
            if (typeof contentVersion !== 'undefined') {
                return contentManager.get(contentID, language, Version(contentVersion))
            } else {
                let version;
                if (isPreview) {
                    version = contentManager.get(contentID, language).version;
                } else {
                    version = contentManager.getLastApprovedVersion(contentID, language);
                }
                return contentManager.get(contentID, language, version);
            }
        }

        function processT4Tags(t4tag, contentID, sectionID, forMediaFile) {
            let cachedContent = content || null;
            let cachedSection = section;
            if (typeof sectionID !== 'undefined' && sectionID !== null && Number(sectionID) > 0) {
                cachedSection = getCachedSectionFromId(sectionID);
            }
            if (contentID === null && sectionID !== null) {
                cachedContent = null;
            } else if (typeof contentID !== 'undefined' && Number(contentID) > 0) {
                cachedContent = getCachedContentFromId(contentID);
                if (cachedContent == null) {
                    throw 'Could not get cachedContent';
                }
            }
            if (cachedSection == null) {
                throw 'Could not get cachedSection';
            }
            if (forMediaFile !== true) {
                forMediaFile = false;
            }
            let renderedHtml = String(BrokerUtils.processT4Tags(dbStatement, publishCache, cachedSection, cachedContent, language, isPreview, t4tag));
            if (forMediaFile) {
                renderedHtml = renderedHtml.replace(/&/gi, '&amp;');
            }
            return renderedHtml;
        }


        // create profiles object
        // replace removes the trailing comma to form valid JSON - added an empty value could cause other issues
        profiles = eval('[' + processT4Tags(profilesNav).replace(/,\s*$/, "") + ']');

        log ('profiles: ' + profiles);

        log('profiles type: ' + typeof profiles);

  

        // if there are profiles...
        if (profiles.length > 0) {
          	let profilesOutput = '';
            
            // sort profiles by nameSort
            // profiles = profiles.sort(sortByName);

            profiles.sort((a, b) => {

                log("a.userId: " + a.userId);
                log('b.userId: ' + b.userId);

                const aPriority = selectedRequestArray.includes(a.userId) ? selectedRequestArray.indexOf(a) : Infinity;
                const bPriority = selectedRequestArray.includes(b.userId) ? selectedRequestArray.indexOf(b) : Infinity;

                return aPriority - bPriority;
            });
            // profiles = profiles.sort((a, b) => {
            //     const indexA = selectedRequestArray.indexOf(a);
            //     const indexB = selectedRequestArray.indexOf(b);
        
            //     // If an item is not in the priority list, put it at the end
            //     if (indexA === -1) return 1;
            //     if (indexB === -1) return -1;
        
            //     return indexA - indexB;
            // });

            // profiles.sort((a, b) => b.selectedRequestArray.includes(profiles.userId) - a.selectedRequestArray.includes(profiles.userID));


            // loop through profiles to create output
            for (let i=0; i<profiles.length; i++) {
              
                profilesOutput += ' <li class="swiper-slide oho-animate fade-in-up">\n';
                profilesOutput += '     <article class="profiles-section--item">\n';
                if (profiles[i].photo != '') {
                    profilesOutput += '         <figure class="aspect-ratio-frame" style="--aspect-ratio: 320/284 ">\n';
                    profilesOutput += '             <img src="' + profiles[i].photo + '" loading="lazy" alt="' + profiles[i].name + '">\n';
                    profilesOutput += '         </figure>\n';
                }
                profilesOutput += '         <div class="text-margin-reset funderline">\n';
                profilesOutput += '             <a href="' + profiles[i].url + '">' + profiles[i].name + '</a>\n';
                profilesOutput += '             <div class="global-spacing--1x">\n';
                profilesOutput += '                 <p>' + profiles[i].positionTitles + '</p>\n';
                profilesOutput += '             </div>\n';
                profilesOutput += '         </div>\n';
                profilesOutput += '     </article>\n';
                profilesOutput += ' </li>\n';
            }

            // if there is output wrap in UL tags
            if (profilesOutput != '') {
                let primaryDept = processT4Tags('<t4 type="content" name="Primary Department" output="normal" display_field="value" />');
                output += ' <t4 type="meta" meta="html_anchor" />';
                output += ' <section class="profiles-section departments-profiles-swiper global-margin--15x">';
                output += '     <div class="grid-container oho-animate-sequence">\n';
                output += '         <div class="grid-x grid-margin-x">\n';
                output += '             <div class="cell large-9">\n';
                output += '                 <div class="section-heading--basic text-margin-reset">\n';
                output += '                     <h2 class="oho-animate fade-in"><t4 type="content" name="Heading" output="normal" modifiers="striptags,htmlentities" /></h2>\n';
                output += '                     <div class="global-spacing--2x oho-animate fade-in">\n';
                output += '                         <p><t4 type="content" name="General Description" output="normal" modifiers="nl2br" /></p>\n';
                output += '                     </div>\n';
                if (primaryDept != '') {
                    output += '                     <div class="section-heading__link global-spacing--2x oho-animate fade-in"><a href="<t4 type="navigation" name="Faculty and Staff Bio Link to Home" id="995" />?staffDepartment=<?php echo urlencode(strtolower("' + primaryDept + '")); ?>">All Faculty &amp; Staff</a></div>\n';
                }
                output += '                 </div>\n';
                output += '             </div>\n';
                output += '         </div>\n';
                output += '         <div class="global-spacing--6x">\n';
                output += '             <div class="swiper-container oho-animate-sequence">\n';
                output += '                 <ul class="swiper-wrapper">\n';
                output += '                     ' + profilesOutput + '\n';
                output += '                 </ul>\n';
                output += '                 <div class="slider-navigation">\n';
                output += '                     <button class="slider-navigation__prev"><i class="far fa-chevron-left" aria-hidden="true"></i><span class="show-for-sr">Go to the previous slide.</span></button>\n';
                output += '                     <button class="slider-navigation__next"><i class="far fa-chevron-right" aria-hidden="true"></i><span class="show-for-sr">Go to the next slide.</span></button>\n';
                output += '                 </div>\n';
                output += '             </div>\n';
                output += '         </div>\n';
                output += '     </div>\n';
                output += ' </section>\n';
            }
        } 

        // Write output
        document.write(processT4Tags(output));
        document.write('');
        if (output == '' && isPreview) {
            document.write('<p style="text-align: center;"><strong>No matching profiles found</strong></p>');
        }
    }
} catch (err) {
    let contentID = typeof content !== 'undefined' ? ' content ID: ' + content.getID() : '';
    let sectionID = typeof section !== 'undefined' ? ' section ID: ' + section.getID() : '';
    let message = 'Programmable Layout Error: ' + err + ' occurred in ' + contentID + sectionID + ')';
    let outputImports = JavaImporter(
        org.apache.commons.lang.StringEscapeUtils,
        java.lang.System
    );
    with (outputImports) {
        if (isPreview) {
            document.write(message);
        } else {
            document.write('<script>console.log("' + StringEscapeUtils.escapeJava(message) + '")</script>');
        }
        System.out.println(message);
    }
}