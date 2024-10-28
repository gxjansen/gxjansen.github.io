import{c as n}from"./Admonition.DdfWBigK.js";import{F as i,$ as a}from"./keystatic-page.CX2dnrWP.js";import"./___vite-browser-external_commonjs-proxy.B2SwpVhP.js";import"./_commonjsHelpers.C4iS2aBk.js";import"./index.zSnisxZ3.js";/* empty css                               */import"./astro/assets-service.CJMMCYvq.js";const s={title:"101 ways to speed up your Magento e-commerce website",description:"Let's optimize your webshop for speed!",draft:!1,authors:["gxjansen"],pubDate:"2010-05-18T00:00:00.000Z",heroImage:"../101-ways-to-speed-up-your-magento-e-commerce-website/heroImage.jpeg",categories:["Magento"]};function f(){return[{depth:3,slug:"a-hosting-environment-general-tips",text:"A) Hosting environment/ General tips"},{depth:3,slug:"b-template",text:"B) Template"},{depth:3,slug:"c-magento-configuration",text:"C) Magento configuration"},{depth:3,slug:"d-speed-testing-analysing-monitoring",text:"D) Speed testing, analysing, monitoring"},{depth:3,slug:"bonus-tips",text:"Bonus Tips"},{depth:3,slug:"so-to-summarize",text:"So to summarize:"},{depth:4,slug:"sources",text:"Sources:"}]}const y=!0;function r(t){const e={a:"a",br:"br",em:"em",h3:"h3",h4:"h4",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...t.components};return n(i,{children:[n(e.p,{children:"As you probably know by now, Google is Using site speed in web search ranking. And I couldn’t agree more: speed is important for your site, and not only for Google but mainly for the User Experience (UX) on your site. Research from Google and Microsoft shows that slower websites convert less and that the effect of a slow website is lasting."}),`
`,n(e.p,{children:[n(e.em,{children:["Sidenote: As a psychologist this might be a form of ",n(e.a,{href:"http://en.wikipedia.org/wiki/D%C3%A9formation_professionnelle",children:"Déformation professionnelle"}),", but I kinda hate it when people always talk about optimizing for search engines/ Google. Don’t optimize for Google, keep in mind that you optimize for your users!"]}),n(e.br,{}),`
`,n(e.br,{}),`
Ok, so nothing new so far (I hope), but what about the speed of your Magento platform? If you’re serious about e-commerce, 9 out of 10 times Magento will be your best choice overall when looking at features, flexibility and TCO. But there are some complaints about Magento being a very slow system and as I just explained: that isn’t good for your UX.`,n(e.br,{}),`
`,n(e.br,{}),`
And although most of these complaints aren’t always fair (off course you’re Magento site is slow when you put it on a cheap shared hosting with 200 other websites!), we all know that of the box Magento isn’t the fastest boy in the class. So that’s where this list comes in…`,n(e.br,{}),`
`,n(e.br,{}),`
Below is the list with 101 ways to speed up your Magento site… Well ok, at the moment I have only 30 45 54, but if you help me out we can make it to 101! When new suggestions come in, I’ll update this post with additional ways to speed up your website. When more tips come in I’ll probably start categorizing them to maintain an overview.`,n(e.br,{}),`
`,n(e.br,{}),`
The tips:`]}),`
`,n(e.h3,{id:"a-hosting-environment-general-tips",children:"A) Hosting environment/ General tips"}),`
`,n(e.ol,{children:[`
`,n(e.li,{children:[`
`,n(e.p,{children:"Get a dedicated server or a VPS from a poster specialised in Magento."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:"Host your site in the country (or at least on the continent) where your customers are. If you have customers worldwide, use a CDN (see tips below on CDN)."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:"Don’t host files on your web server that you do not use, large or small."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:"Goto MySQL Admin and select all the tables and repair and then optimize them. Small effect but good to check. Do things in MySQL break often? Get a new hoster."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:"IF you have PHP6 or lower: Use a PHP accelerator like APC, ZendOptimizer+ or Xcache. No longer needed with PHP7."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:["APC – ",n(e.a,{href:"http://pecl.php.net/package/APC",children:"http://pecl.php.net/package/APC"}),". Increased the APC.shm.size to something like 128 to allow more data to be cached by apc."]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:["Xcache – ",n(e.a,{href:"http://xcache.lighttpd.net/",children:"http://xcache.lighttpd.net/"})]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:"Only install necessary database modules."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:"Swap Apache for NginX or Litespeed."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:["[REPLACED by nginx_pagespeed] Use Apache mod_expires and be sure to set how long files should be cached. You could use the example below for your Apache virtualhost config:",n(e.br,{}),`
# Turn on Expires and set default to 0`,n(e.br,{}),`
               ExpiresActive On`,n(e.br,{}),`
               ExpiresDefault A0`,n(e.br,{}),`
`,n(e.br,{}),`
               # Set up caching on media files for 1 year (forever?)`,n(e.br,{}),`
`,n(e.br,{}),`
                       ExpiresDefault A29030400`,n(e.br,{}),`
                       Header append Cache-Control “public”`,n(e.br,{}),`
`,n(e.br,{}),`
               # Set up caching on media files for 2 weeks`,n(e.br,{}),`
`,n(e.br,{}),`
                       ExpiresDefault A1209600`,n(e.br,{}),`
                       Header append Cache-Control “public”`,n(e.br,{}),`
`,n(e.br,{}),`
               # Set up 1 week caching on commonly updated files`,n(e.br,{}),`
`,n(e.br,{}),`
                       ExpiresDefault A604800`,n(e.br,{}),`
                       Header append Cache-Control “proxy-revalidate”`,n(e.br,{}),`
`,n(e.br,{}),`
               # Force no caching for dynamic files`,n(e.br,{}),`
`,n(e.br,{}),`
                       ExpiresActive Off`,n(e.br,{}),`
                       Header set Cache-Control “private, no-cache, no-store, proxy-revalidate, no-transform”`,n(e.br,{}),`
                       Header set Pragma “no-cache”\\`]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:["[REPLACED by nginx_pagespeed] ",n(e.a,{href:"http://inchoo.net/ecommerce/magento/boost-the-speed-of-your-magento/",children:"Enable Gzip Compression in htaccess"}),". > REPLACED by nginx_pagespeed"]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:"Compress output, use zlib.output_compression or mod_deflate."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:["Use a Content Delivery Network (CDN) for parallel transfer of static content. There is a Magento extension that can help you do this with category and product images: the ",n(e.a,{href:"http://www.magentocommerce.com/magento-connect/One+Pica/extension/1279/one-pica-image-cdn",children:"One Pica Image CDN"}),". But… (see next tip)."]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:"Don’t use too many different external sources (for images, iframes, (twitter/facebook)feeds etc.) because every DNS lookup takes extra time and you create an extra dependancy (on some 3rd party server) for your site to load properly."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:["(If you still use Apache) Enable Apache KeepAlives: Make sure your Apache configuration has KeepAlives enabled. KeepAlives are a trick where multiple HTTP requests can be funneled through a single TCP connection. The setup of each TCP connection incurs additional time, this can significantly reduce the time it takes to download all the files (HTML, JavaScript, images) for a website. More info  at ",n(e.a,{href:"http://httpd.apache.org/docs/2.2/mod/core.html#keepalive",children:"Apache.org"}),". Be carefull though, I’ve heard from some that this create (a lot of) extra load on the server and might crash the server on high traffic moments!"]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:"Minimize redirects."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:"Make your output W3C compliant at least do cross-browser testing. Errors slow down the browser."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:"Turn off or at least reduce web server logging (reduces disk writes)."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:["Disable Access Time Logging. For Linux servers, if you have access-time logging enabled on any of your mysql, web server or cache partitions, try turning it off for a performance boost. If you’re using ext3 or reiserfs there may be faster journal write methods you can use. For more info see ",n(e.a,{href:"http://www.linux.com/feature/116693",children:"Linux.com"}),"."]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:"Compile MySQL from source instead of your OS’s package manager. You can also use Percona or MariaDB."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:"Always upgrade to the latest Magento version. Not only will you get more features and bug- and security fixes, but with every update Magento performs better."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:["Query Cach size: ",n(e.a,{href:"http://www.magentocommerce.com/blog/performance-is-key-notes-on-magentos-performance",children:"Magento Blog"}),": Modify the configuration for your MySQL server to take better advantage of your server’s RAM. Most Linux distributions provide a conservative MySQL package out of the box to ensure it will run on a wide array of hardware configurations. If you have ample RAM (eg, 1gb or more), then you may want to try tweaking the configuration. An example my.cnf is below, though you will want to consult the MySQL documentation for a complete list of configuration directives and recommended settings. A proper MySQL setup is very important with Magento."]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:"set ‘php_value memory_limit 512M’ in your php configuration or add it to your .htaccess file to ensure you don’t run out of memory."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:["Use a memory-based filesystem for dynamic data. If you store dynamic data (",n(e.strong,{children:"var/cache"}),", ",n(e.strong,{children:"var/session"}),") on RAMdisk or tmpfs, the disk I/O is decreased. Use Redis / RedisSession"]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:["Change realpath_cache_size in php.ini.",n(e.br,{}),`
realpath_cache_size=1M (careful, this is per apache process) realpath_cache_ttl=86400 (ok for production site) `]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:["Memcache (for the hardcore) is documented in ",n(e.a,{href:"http://www.magentocommerce.com/boards/viewthread/9037/",children:"http://www.magentocommerce.com/boards/viewthread/9037/"})," and more tips from ",n(e.a,{href:"http://alexle.net/archives/275",children:"http://alexle.net/archives/275"})," to get you up and running. Or use Redis."]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:["Disable the PHP open_basedir directive. ",n(e.a,{href:"http://blog.nexcess.net/2010/03/31/php-open_basedir-and-magento-performance/",children:"Read this"}),"."]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:"Eliminate directory structure scans for .htaccess files. Or use nginx."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:"Recommended innodb_buffer_pool_size."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:["Combined web and db server, 6 GB RAM:  ",n(e.strong,{children:"2-3 GB"})]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:["Dedicated database server, 6GB RAM: ",n(e.strong,{children:"5 GB"})]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:["Dedicated database server, 12 GB RAM: ",n(e.strong,{children:"10 GB"})]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:"innodb_thread_concurrency."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:n(e.strong,{children:"2 * [numberofCPUs] + 2"})}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:"Query Cach: query_cache_size: 64MB, query_cache_limit: 2MB. Depends on the server though."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:"Usually 1 (fat) server should be able to handle everything. If you do a lot of backend work during peak hours however you could consider using a seperate backend server to handle admin users, process backend activity (cron), pre generate full page caching and to handle media queries."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:"If 1 fat server isn’t enough: use multiple web nodes (frontend servers) to handle browsing and checkout."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:["Use ",n(e.a,{href:"https://www.varnish-cache.org/",children:"Varnish reverse proxy caching"}),". If you use EE, just use FPC since it’s easier to tweak compared to Varnish."]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:["If you have a popular site that is heavily crawled by searchengines, you can save some resources by tweaking your ",n(e.a,{href:"http://www.byte.nl/blog/2012/06/11/magento-robots-txt/",children:"robots.txt"}),"."]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:"Try some of these cache extensions: "}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:n(e.a,{href:"https://github.com/GordonLesti/Lesti_Fpc",children:"https://github.com/GordonLesti/Lesti_Fpc"})}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:n(e.a,{href:"http://www.artio.net/magento-extensions/m-turbo-accelerator",children:"http://www.artio.net/magento-extensions/m-turbo-accelerator"})}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:n(e.a,{href:"http://www.aitoc.com/en/magento_booster.html",children:"http://www.aitoc.com/en/magento_booster.html"})}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:n(e.a,{href:"http://www.tinybrick.com/magento-modules/performance.html/",children:"http://www.tinybrick.com/magento-modules/performance.html/"})}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:["Install the ",n(e.a,{href:"http://www.yireo.com/software/magento-extensions/disablelog",children:"Yireo DisableLog"})," addon. It prevents Magento writing tons of stuff to your database which is useless when you’re already using something like Google Analytics."]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:["Use Magento with HHVM (HipHop Virtual Machine). Facebook uses this too and they reported 6x to 9x server performance improvement. See ",n(e.a,{href:"http://www.slideshare.net/MeetMagentoNY2014/jenna-warren-14pm-23-sept",children:"http://www.slideshare.net/MeetMagentoNY2014/jenna-warren-14pm-23-sept"}),"."]}),`
`]}),`
`]}),`
`,n(e.h3,{id:"b-template",children:"B) Template"}),`
`,n(e.ol,{children:[`
`,n(e.li,{children:[`
`,n(e.p,{children:"Optimize all your (template) images- Most if not all should be at least below 10kb. Use nginx_pagespeed."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:"Crop the white space using your image editor."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:"Use PNG8 Files or GIF files rather than Jpegs and don’t use transparency (depending on how many colors you use and how large the image is, but try for yourself)."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:"Scale images: make images in the dimensions you need and not resizing them in the editor."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:["Use image compression (you can use ",n(e.a,{href:"http://developer.yahoo.com/yslow/smushit/",children:"smush.it"})," to do it for you)."]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:["Use",n(e.a,{href:"http://css-tricks.com/css-sprites/",children:" CSS Sprites"}),", there even are ",n(e.a,{href:"http://www.google.nl/search?q=css+sprite+generator",children:"CSS Sprite Generators"}),"."]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:"Minify your Css, remove unused code. Use nginx_pagespeed."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:"Minimize Javascript use. Use nginx_pagespeed."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:"Use a lightweight template as a basis for your template."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:"Specify Image dimensions."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:["Use ",n(e.a,{href:"http://www.magentocommerce.com/wiki/development/block_cache_and_html_ouput",children:"Block cache and HTML output"})," in your extensions."]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:["Apply Javascript ",n(e.a,{href:"http://www.bram.us/projects/js_bramus/lazierload/",children:"Lazy Loader for prototype"}),"."]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:["Move all JavaScript to the end of the page ",n(e.a,{href:"https://github.com/bobbyshaw/magento-footer-js",children:"https://github.com/bobbyshaw/magento-footer-js"}),"."]}),`
`]}),`
`]}),`
`,n(e.h3,{id:"c-magento-configuration",children:"C) Magento configuration"}),`
`,n(e.ol,{children:[`
`,n(e.li,{children:[`
`,n(e.p,{children:"Uninstall any extensions that you don’t actually use."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:["Disable modules that you don’t use: ",n(e.em,{children:"System -> Configuration -> Advanced -> Advanced."})]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:"This is an example setting[/caption]"}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:["Enable all Magento Caches: *System -> Cache Management.",n(e.br,{}),`
`,n(e.br,{}),`
*`]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:"Use an offsite Stats Tracker like Google Analytics and not an onsite one. Most of this will use Javascript, host the Javascript yourself."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:", whichever works best for you.\\"}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:["Try some of the ",n(e.a,{href:"http://www.magentocommerce.com/magento-connect/catalogsearch/result/?id=&s=1&pl=0&te=0&xc=0&q=performance&t=0&p=1",children:"Magento performance extensions"}),". Research the extensions, ask around fir experiences."]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:["Enable the Magento ",n(e.a,{href:"http://www.magentocommerce.com/blog/comments/magento-version-130-is-now-available/",children:"Flat Catalog"}),"."]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:"Don’t use layered navigation if you don’t really need it, it’s resource intensive."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:"Don’t use Magento’s Compilation feature. Use Aoe_ClassPathCache instead."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:"Use the correct session storage, choose file system or database (during setup). Most installations should use “file system” because it’s faster and doesn’t cause the database to grow. If you’re on a cluster, use RedisSession."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:"If it’s good for your conversion, show more products. But be aware that showing more product on a category page will increase page load. But conversion trumps page load so test it."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:["Set only those attribute frontend properties to ‘Yes’ that you’re actually going to use. Set all other to ‘No’. Don’t use in quick search, advanced search compare, etc etc.: ",n(e.em,{children:"Catalog -> Attributes -> Manage Atributes -> Frontend Properties."})]}),`
`]}),`
`]}),`
`,n(e.p,{children:n(e.em,{children:"Enterprise only tip:"})}),`
`,n(e.ul,{children:[`
`,n(e.li,{children:[`
`,n(e.p,{children:["Disable Enterprise_CatalogEvent. Go to Admin -> System -> Configuration -> Catalog -> Catalog Events.",n(e.br,{}),`
Then you want to turn off the settings for “Enable Catalog Events Functionality” and “Enable Catalog Event Widget”.`]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:"Enable Solr search, it’s quicker compared to the default setup, especially when you have lots of products (>10k)."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:"Enable Full Page Caching."}),`
`]}),`
`]}),`
`,n(e.h3,{id:"d-speed-testing-analysing-monitoring",children:"D) Speed testing, analysing, monitoring"}),`
`,n(e.ol,{children:[`
`,n(e.li,{children:[`
`,n(e.p,{children:["Test your Magento site with ",n(e.a,{href:"http://www.magespeedtest.com/",children:"Magento Speed Test"})," (by ",n(e.a,{href:"http://www.aschroder.com/category/magento/",children:"Ashley Schroder"}),") or look for the TTFB in your inspector."]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:["Run your site through ",n(e.a,{href:"http://www.websiteoptimization.com/services/analyze/",children:"websiteoptimization.com"}),"."]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:["Use Google Page Speed Firefox extension or ",n(e.a,{href:"http://developer.yahoo.com/yslow/",children:"Yahoo Yslow"})," for some tips from Google and Yahoo."]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:["Implement Google Speed measurements in Analytics: ",n(e.a,{href:"http://analytics.blogspot.com/2011/05/measure-page-load-time-with-site-speed.html",children:"Measure Page Load Time with Site Speed Analytics Report"})]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:["Speed monitoring and downtime alerts.",n(e.br,{}),`
`,n(e.br,{}),`
   `]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:n(e.a,{href:"http://mon.itor.us/",children:"Mon.itor.us"})}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:n(e.a,{href:"http://www.pingdom.com/",children:"Pingdom"})}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:["Send logs to a logging service like laggy for useful alerts. See ",n(e.a,{href:"https://github.com/firegento/firegento-logger",children:"https://github.com/firegento/firegento-logger"})]}),`
`]}),`
`]}),`
`,n(e.h3,{id:"bonus-tips",children:"Bonus Tips"}),`
`,n(e.p,{children:"(because it doesn’t actually speed up the frontend but only the backend):"}),`
`,n(e.ul,{children:[`
`,n(e.li,{children:[`
`,n(e.p,{children:["Use ",n(e.a,{href:"http://kmeleon.sourceforge.net/",children:"K-Meleon"})," if you are on Windows for your general Admin work. It renders Magento’s heavy JS back-end significantly faster than any other browser."]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:["Use the ",n(e.a,{href:"http://www.yireo.com/software/magento-extensions/googlegears-for-magento",children:"GoogleGears extension from Yireo.com"})," to cache static files locally."]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:["Use a local pc/mac application to manage Magento (like ",n(e.a,{href:"http://www.mag-manager.com/",children:"mag-manager.com"}),")."]}),`
`]}),`
`]}),`
`,n(e.h3,{id:"so-to-summarize",children:"So to summarize:"}),`
`,n(e.ul,{children:[`
`,n(e.li,{children:[`
`,n(e.p,{children:"Use a big fat server configured by a Magento specialist. Hardware helps, but configuration is key."}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:["Use nginx + nginx_pagespeed and use mod_pagespeed to tweak (see ",n(e.a,{href:"https://www.h-o.nl/blog/best-magento-mod_pagespeed-configuration",children:"https://www.h-o.nl/blog/best-magento-mod_pagespeed-configuration"}),")."]}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:"Use the latest PHP version (currently 7) or HHVM"}),`
`]}),`
`,n(e.li,{children:[`
`,n(e.p,{children:"Use a CDN like Cloudflare."}),`
`]}),`
`]}),`
`,n(e.p,{children:["I do realize that you probably can’t use all of the above tips but it’s not about using them all, and sometimes you just make the choice to give a functionality a priority over performance and that’s OK. If you can only apply some of them you will still increase speed and gain in user experience. And remember: because speed depends on many variables, some of the tips might not have an impact on your website at all while others can have a huge impact. So always test the impact of every step you take and take actions accordingly.",n(e.br,{}),`
`,n(e.br,{}),`
`,n(e.strong,{children:"Do you have any tips? Post them in the comments and I’ll add them to the list!"})]}),`
`,n(e.h4,{id:"sources",children:"Sources:"}),`
`,n(e.p,{children:"My own experience :) | Google Page Speed |"})]})}function l(t={}){const{wrapper:e}=t.components||{};return e?n(e,{...t,children:n(r,{...t})}):r(t)}const b="src/content/blog/en/101-ways-to-speed-up-your-magento-e-commerce-website/index.mdx",w="/Users/gxjansen/Documents/GitHub/gxjansen.github.io/src/content/blog/en/101-ways-to-speed-up-your-magento-e-commerce-website/index.mdx",o=(t={})=>l({...t,components:{Fragment:i,...t.components,"astro-image":t.components?.img??a}});o[Symbol.for("mdx-component")]=!0;o[Symbol.for("astro.needsHeadRendering")]=!s.layout;o.moduleId="/Users/gxjansen/Documents/GitHub/gxjansen.github.io/src/content/blog/en/101-ways-to-speed-up-your-magento-e-commerce-website/index.mdx";export{o as Content,y as __usesAstroImage,o as default,w as file,s as frontmatter,f as getHeadings,b as url};
