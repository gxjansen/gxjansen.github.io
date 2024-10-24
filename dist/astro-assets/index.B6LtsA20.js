const n="en/101-ways-to-speed-up-your-magento-e-commerce-website/index.mdx",a="blog",s="en/101-ways-to-speed-up-your-magento-e-commerce-website",r=`As you probably know by now, Google is Using site speed in web search ranking. And I couldn't agree more: speed is important for your site, and not only for Google but mainly for the User Experience (UX) on your site. Research from Google and Microsoft shows that slower websites convert less and that the effect of a slow website is lasting.

*Sidenote: As a psychologist this might be a form of [Déformation professionnelle](http://en.wikipedia.org/wiki/D%C3%A9formation_professionnelle), but I kinda hate it when people always talk about optimizing for search engines/ Google. Don't optimize for Google, keep in mind that you optimize for your users!*\\
\\
Ok, so nothing new so far (I hope), but what about the speed of your Magento platform? If you're serious about e-commerce, 9 out of 10 times Magento will be your best choice overall when looking at features, flexibility and TCO. But there are some complaints about Magento being a very slow system and as I just explained: that isn't good for your UX.\\
\\
And although most of these complaints aren't always fair (off course you're Magento site is slow when you put it on a cheap shared hosting with 200 other websites!), we all know that of the box Magento isn't the fastest boy in the class. So that's where this list comes in...\\
\\
Below is the list with 101 ways to speed up your Magento site... Well ok, at the moment I have only 30 45 54, but if you help me out we can make it to 101! When new suggestions come in, I'll update this post with additional ways to speed up your website. When more tips come in I'll probably start categorizing them to maintain an overview.\\
\\
The tips:

### A) Hosting environment/ General tips

1. Get a dedicated server or a VPS from a poster specialised in Magento.

2. Host your site in the country (or at least on the continent) where your customers are. If you have customers worldwide, use a CDN (see tips below on CDN).

3. Don't host files on your web server that you do not use, large or small.

4. Goto MySQL Admin and select all the tables and repair and then optimize them. Small effect but good to check. Do things in MySQL break often? Get a new hoster.

5. IF you have PHP6 or lower: Use a PHP accelerator like APC, ZendOptimizer+ or Xcache. No longer needed with PHP7.

6. APC – [http://pecl.php.net/package/APC](http://pecl.php.net/package/APC). Increased the APC.shm.size to something like 128 to allow more data to be cached by apc.

7. Xcache – [http://xcache.lighttpd.net/](http://xcache.lighttpd.net/)

8. Only install necessary database modules.

9. Swap Apache for NginX or Litespeed.

10. \\[REPLACED by nginx\\_pagespeed] Use Apache mod\\_expires and be sure to set how long files should be cached. You could use the example below for your Apache virtualhost config:\\
    \\# Turn on Expires and set default to 0\\
                   ExpiresActive On\\
                   ExpiresDefault A0\\
    \\
                   # Set up caching on media files for 1 year (forever?)\\
    \\
                           ExpiresDefault A29030400\\
                           Header append Cache-Control "public"\\
    \\
                   # Set up caching on media files for 2 weeks\\
    \\
                           ExpiresDefault A1209600\\
                           Header append Cache-Control "public"\\
    \\
                   # Set up 1 week caching on commonly updated files\\
    \\
                           ExpiresDefault A604800\\
                           Header append Cache-Control "proxy-revalidate"\\
    \\
                   # Force no caching for dynamic files\\
    \\
                           ExpiresActive Off\\
                           Header set Cache-Control "private, no-cache, no-store, proxy-revalidate, no-transform"\\
                           Header set Pragma "no-cache"\\


11. \\[REPLACED by nginx\\_pagespeed] [Enable Gzip Compression in htaccess](http://inchoo.net/ecommerce/magento/boost-the-speed-of-your-magento/). > REPLACED by nginx\\_pagespeed

12. Compress output, use zlib.output\\_compression or mod\\_deflate.

13. Use a Content Delivery Network (CDN) for parallel transfer of static content. There is a Magento extension that can help you do this with category and product images: the [One Pica Image CDN](http://www.magentocommerce.com/magento-connect/One+Pica/extension/1279/one-pica-image-cdn). But... (see next tip).

14. Don't use too many different external sources (for images, iframes, (twitter/facebook)feeds etc.) because every DNS lookup takes extra time and you create an extra dependancy (on some 3rd party server) for your site to load properly.

15. (If you still use Apache) Enable Apache KeepAlives: Make sure your Apache configuration has KeepAlives enabled. KeepAlives are a trick where multiple HTTP requests can be funneled through a single TCP connection. The setup of each TCP connection incurs additional time, this can significantly reduce the time it takes to download all the files (HTML, JavaScript, images) for a website. More info  at [Apache.org](http://httpd.apache.org/docs/2.2/mod/core.html#keepalive). Be carefull though, I've heard from some that this create (a lot of) extra load on the server and might crash the server on high traffic moments!

16. Minimize redirects.

17. Make your output W3C compliant at least do cross-browser testing. Errors slow down the browser.

18. Turn off or at least reduce web server logging (reduces disk writes).

19. Disable Access Time Logging. For Linux servers, if you have access-time logging enabled on any of your mysql, web server or cache partitions, try turning it off for a performance boost. If you’re using ext3 or reiserfs there may be faster journal write methods you can use. For more info see [Linux.com](http://www.linux.com/feature/116693).

20. Compile MySQL from source instead of your OS’s package manager. You can also use Percona or MariaDB.

21. Always upgrade to the latest Magento version. Not only will you get more features and bug- and security fixes, but with every update Magento performs better.

22. Query Cach size: [Magento Blog](http://www.magentocommerce.com/blog/performance-is-key-notes-on-magentos-performance): Modify the configuration for your MySQL server to take better advantage of your server’s RAM. Most Linux distributions provide a conservative MySQL package out of the box to ensure it will run on a wide array of hardware configurations. If you have ample RAM (eg, 1gb or more), then you may want to try tweaking the configuration. An example my.cnf is below, though you will want to consult the MySQL documentation for a complete list of configuration directives and recommended settings. A proper MySQL setup is very important with Magento.

23. set 'php\\_value memory\\_limit 512M' in your php configuration or add it to your .htaccess file to ensure you don't run out of memory.

24. Use a memory-based filesystem for dynamic data. If you store dynamic data (**var/cache**, **var/session**) on RAMdisk or tmpfs, the disk I/O is decreased. Use Redis / RedisSession

25. Change realpath\\_cache\\_size in php.ini.\\
    realpath\\_cache\\_size=1M (careful, this is per apache process) realpath\\_cache\\_ttl=86400 (ok for production site)&#x20;

26. Memcache (for the hardcore) is documented in [http://www.magentocommerce.com/boards/viewthread/9037/](http://www.magentocommerce.com/boards/viewthread/9037/) and more tips from http\\://alexle.net/archives/275 to get you up and running. Or use Redis.

27. Disable the PHP open\\_basedir directive. [Read this](http://blog.nexcess.net/2010/03/31/php-open_basedir-and-magento-performance/).

28. Eliminate directory structure scans for .htaccess files. Or use nginx.

29. Recommended innodb\\_buffer\\_pool\\_size.

30. Combined web and db server, 6 GB RAM:  **2-3 GB**

31. Dedicated database server, 6GB RAM: **5 GB**

32. Dedicated database server, 12 GB RAM: **10 GB**

33. innodb\\_thread\\_concurrency.

34. **2 \\* \\[numberofCPUs] + 2**

35. Query Cach: query\\_cache\\_size: 64MB, query\\_cache\\_limit: 2MB. Depends on the server though.

36. Usually 1 (fat) server should be able to handle everything. If you do a lot of backend work during peak hours however you could consider using a seperate backend server to handle admin users, process backend activity (cron), pre generate full page caching and to handle media queries.

37. If 1 fat server isn't enough: use multiple web nodes (frontend servers) to handle browsing and checkout.

38. Use [Varnish reverse proxy caching](https://www.varnish-cache.org/). If you use EE, just use FPC since it's easier to tweak compared to Varnish.

39. If you have a popular site that is heavily crawled by searchengines, you can save some resources by tweaking your [robots.txt](http://www.byte.nl/blog/2012/06/11/magento-robots-txt/).

40. Try some of these cache extensions: 

41. https\\://github.com/GordonLesti/Lesti\\_Fpc

42. http\\://www\\.artio.net/magento-extensions/m-turbo-accelerator

43. http\\://www\\.aitoc.com/en/magento\\_booster.html

44. http\\://www\\.tinybrick.com/magento-modules/performance.html/

45. Install the [Yireo DisableLog](http://www.yireo.com/software/magento-extensions/disablelog) addon. It prevents Magento writing tons of stuff to your database which is useless when you're already using something like Google Analytics.

46. Use Magento with HHVM (HipHop Virtual Machine). Facebook uses this too and they reported 6x to 9x server performance improvement. See http\\://www\\.slideshare.net/MeetMagentoNY2014/jenna-warren-14pm-23-sept.

### B) Template

1. Optimize all your (template) images- Most if not all should be at least below 10kb. Use nginx\\_pagespeed.

2. Crop the white space using your image editor.

3. Use PNG8 Files or GIF files rather than Jpegs and don't use transparency (depending on how many colors you use and how large the image is, but try for yourself).

4. Scale images: make images in the dimensions you need and not resizing them in the editor.

5. Use image compression (you can use [smush.it](http://developer.yahoo.com/yslow/smushit/) to do it for you).

6. Use[ CSS Sprites](http://css-tricks.com/css-sprites/), there even are [CSS Sprite Generators](http://www.google.nl/search?q=css+sprite+generator).

7. Minify your Css, remove unused code. Use nginx\\_pagespeed.

8. Minimize Javascript use. Use nginx\\_pagespeed.

9. Use a lightweight template as a basis for your template.

10. Specify Image dimensions.

11. Use [Block cache and HTML output](http://www.magentocommerce.com/wiki/development/block_cache_and_html_ouput) in your extensions.

12. Apply Javascript [Lazy Loader for prototype](http://www.bram.us/projects/js_bramus/lazierload/).

13. Move all JavaScript to the end of the page https\\://github.com/bobbyshaw/magento-footer-js.

### C) Magento configuration

1. Uninstall any extensions that you don't actually use.

2. Disable modules that you don't use: *System -> Configuration -> Advanced -> Advanced.*

3. This is an example setting\\[/caption]

4. Enable all Magento Caches: *System -> Cache Management.\\
   \\
   *

5. Use an offsite Stats Tracker like Google Analytics and not an onsite one. Most of this will use Javascript, host the Javascript yourself.

6. , whichever works best for you.\\


7. Try some of the [Magento performance extensions](http://www.magentocommerce.com/magento-connect/catalogsearch/result/?id=\\&s=1\\&pl=0\\&te=0\\&xc=0\\&q=performance\\&t=0\\&p=1). Research the extensions, ask around fir experiences.

8. Enable the Magento [Flat Catalog](http://www.magentocommerce.com/blog/comments/magento-version-130-is-now-available/).

9. Don't use layered navigation if you don't really need it, it's resource intensive.

10. Don't use Magento's Compilation feature. Use Aoe\\_ClassPathCache instead.

11. Use the correct session storage, choose file system or database (during setup). Most installations should use "file system" because it's faster and doesn't cause the database to grow. If you're on a cluster, use RedisSession.

12. If it's good for your conversion, show more products. But be aware that showing more product on a category page will increase page load. But conversion trumps page load so test it.

13. Set only those attribute frontend properties to 'Yes' that you're actually going to use. Set all other to 'No'. Don't use in quick search, advanced search compare, etc etc.: *Catalog -> Attributes -> Manage Atributes -> Frontend Properties.*

*Enterprise only tip:*

* Disable Enterprise\\_CatalogEvent. Go to Admin -> System -> Configuration -> Catalog -> Catalog Events.\\
  Then you want to turn off the settings for "Enable Catalog Events Functionality" and "Enable Catalog Event Widget".

* Enable Solr search, it's quicker compared to the default setup, especially when you have lots of products (>10k).

* Enable Full Page Caching.

### D) Speed testing, analysing, monitoring

1. Test your Magento site with [Magento Speed Test](http://www.magespeedtest.com/) (by [Ashley Schroder](http://www.aschroder.com/category/magento/)) or look for the TTFB in your inspector.

2. Run your site through [websiteoptimization.com](http://www.websiteoptimization.com/services/analyze/).

3. Use Google Page Speed Firefox extension or [Yahoo Yslow](http://developer.yahoo.com/yslow/) for some tips from Google and Yahoo.

4. Implement Google Speed measurements in Analytics: [Measure Page Load Time with Site Speed Analytics Report](http://analytics.blogspot.com/2011/05/measure-page-load-time-with-site-speed.html)

5. Speed monitoring and downtime alerts.\\
   \\
      

6. [Mon.itor.us](http://mon.itor.us/)

7. [Pingdom](http://www.pingdom.com/)

8. Send logs to a logging service like laggy for useful alerts. See https\\://github.com/firegento/firegento-logger

### Bonus Tips

(because it doesn't actually speed up the frontend but only the backend):

* Use [K-Meleon](http://kmeleon.sourceforge.net/) if you are on Windows for your general Admin work. It renders Magento’s heavy JS back-end significantly faster than any other browser.

* Use the [GoogleGears extension from Yireo.com](http://www.yireo.com/software/magento-extensions/googlegears-for-magento) to cache static files locally.

* Use a local pc/mac application to manage Magento (like [mag-manager.com](http://www.mag-manager.com/)).

### So to summarize:

* Use a big fat server configured by a Magento specialist. Hardware helps, but configuration is key.

* Use nginx + nginx\\_pagespeed and use mod\\_pagespeed to tweak (see https\\://www\\.h-o.nl/blog/best-magento-mod\\_pagespeed-configuration).

* Use the latest PHP version (currently 7) or HHVM

* Use a CDN like Cloudflare.

I do realize that you probably can't use all of the above tips but it's not about using them all, and sometimes you just make the choice to give a functionality a priority over performance and that's OK. If you can only apply some of them you will still increase speed and gain in user experience. And remember: because speed depends on many variables, some of the tips might not have an impact on your website at all while others can have a huge impact. So always test the impact of every step you take and take actions accordingly.\\
\\
**Do you have any tips? Post them in the comments and I'll add them to the list!**

#### Sources:

My own experience :) | Google Page Speed |
`,i={title:"101 ways to speed up your Magento e-commerce website",description:"Let's optimize your webshop for speed!",authors:[{slug:"gxjansen",collection:"authors"}],pubDate:new Date(12741408e5),heroImage:new Proxy({src:"/astro-assets/heroImage.pwEQGeu2.jpeg",width:6016,height:4016,format:"jpg",fsPath:"/Users/gxjansen/Documents/GitHub/gxjansen.github.io/src/content/blog/en/101-ways-to-speed-up-your-magento-e-commerce-website/heroImage.jpeg"},{get(t,e,o){return e==="clone"?structuredClone(t):e==="fsPath"?"/Users/gxjansen/Documents/GitHub/gxjansen.github.io/src/content/blog/en/101-ways-to-speed-up-your-magento-e-commerce-website/heroImage.jpeg":t[e]}}),categories:["Magento"],draft:!1},c={type:"content",filePath:"/Users/gxjansen/Documents/GitHub/gxjansen.github.io/src/content/blog/en/101-ways-to-speed-up-your-magento-e-commerce-website/index.mdx",rawData:void 0};export{c as _internal,r as body,a as collection,i as data,n as id,s as slug};
