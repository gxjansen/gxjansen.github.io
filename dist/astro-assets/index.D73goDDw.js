const n="en/often-confused-commerce-terms/index.mdx",a="blog",s="en/often-confused-commerce-terms",r=`Recently I've seen some (often absolute) statements going around, generally in the line of "open source commerce platforms are a terrible idea". Now of course different solutions always have different pros and cons.

But I see quite a bit of attributes being assigned to open source software that are either not at all representative of all open source solutions OR not at all exclusive to open source.

Terms like **open source**, **monolithic, single-tenant** and **on-premise** are put in a box on one side of the equation and **microservices, multi-tenant** and **hosted/SaaS** on the other hand, often implying that everything in the box is the same.

Sure, these terms are related and some might often co-exist. But they are far from the same thing and understanding the difference is crucial when you're doing research for your next commerce platform.

> Just like **green**, **apple** and **fruit** are related, it's silly to state that all fruits are apples, all apples are green or all green things are fruits. That just doesn't make sense.

## Terminology

Before going through some specific statements I've seen around, let’s start with a boring terminology list (with additional commerce context) so we're all on the same page. Please note that I'm by no means the gatekeeper of commerce terms, but I thought it would be useful for others that are also confused by these terms to provide some clarity on things.

* **Open source:** this could refer to two things: (1) is the source code “public/visible” to everyone who wants to see it and/or (2) the type of license model of the software determining the legal use of the software (see [opensource.org](https://opensource.org/licenses) for an overview). For example: Shopware has both (1) and (2), Spryker has (1) and Adobe Commerce Cloud has neither.

* **On-premise:** software that is hosted at the location or at least on servers owned/maintained by the merchant itself (or by a 3rd party hired by the merchant).  

* **Monolithic:** a single piece of software that combines a lot of related features that are often intertwined and not easily separated. Adobe Commerce is often mentioned as an example here (see [Monolithic Application](https://en.wikipedia.org/wiki/Monolithic_application)).

* **Microservice:** Microservices - also known as the microservice architecture - is an architectural style that structures an application as a collection of services that are (see [Microservices](https://en.wikipedia.org/wiki/Microservices)). To run a full-fledged commerce store, you'd need tens if not hundreds of microservices that tie together.

* **Packaged Business Capabilities:** PBCs represent a middleground between microservices and monolithic platforms. Their ability to work independently of other PBCs allows agile updates, changes and extensions, with no interference to the tech stack as a whole. Some example PBCs: PIM, Offer management, Tax management, CMS, Storefront, Gift cards... etc etc

   ![](../often-confused-commerce-terms/Webflow%20gui.do.jpeg)

* **Single-tenant**: A single instance of the software and supporting infrastructure serve a single customer. Essentially, there is no sharing happening with this option.

* **Multi-tenant**: A single instance of the software and its supporting infrastructure serves multiple customers. Each customer shares the software application and often also shares a single database. Each tenant’s data is isolated and remains invisible to other tenants.

* **SaaS**: Software as a Service: Applications which are managed and delivered by a third-party vendor, to its users. A majority of SaaS applications run directly through your web browser. Example: Shopify.

* **PaaS**: Platform as a Service: a complete development and deployment environment in the cloud, with resources that enable developers to deliver everything from simple cloud-based apps to sophisticated, cloud-enabled enterprise applications. Example: Spryker.

I don’t want to write a whole PaaS vs SaaS explainer here, but [PaaS, Saas or Both](https://spryker.com/en/blog/paas-saas-or-both?utm_source=gui.do\\&utm_medium=website\\&utm_campaign=Guido_X_Jansen) is nice blog post explaining the differences if you want to dive deeper into that. Spryker also created a nice [PaaS or SaaS or on-premise decision tree](https://spryker.com/en/decision-tree-cloud?utm_source=gui.do\\&utm_medium=website\\&utm_campaign=Guido_X_Jansen) for you to get a feel for the differences:

![](../often-confused-commerce-terms/Webflow%20gui.do%20\\(1\\).jpeg)   

## Debunking the statements

So now that we have some basics covered, lets circle back to some of the specific statements I've encountered and how I personally see these. I've copied these 1-on-1 from some posts.

### ***"Open source has to be deployed/run/managed on your own. Need people on call 24/7"***

**All** software has to be deployed/run/managed, open source or otherwise. As a merchant you can pull these tasks/responsibilities towards you or move it away from you:

* You can have your own people to do it.

* You can hire a 3rd party agency / system integrator to do it.

* You can let the company that made the software do it and maybe they even host it for you.

There are several open source commerce platforms that offer their software in a SaaS/PaaS variant, sometimes in addition to an on-premise variant: [Spryker](https://spryker.com?utm_source=gui.do\\&utm_medium=website\\&utm_campaign=Guido_X_Jansen), [Woocommerce](https://woocommerce.com/), [Shopware](https://www.shopware.com/) and also PIM solutions like [Akeneo](https://www.akeneo.com/) all do this.

So it's **perfectly possible** to run open source as a SaaS service and not having to worry about deploying/running/managing it as a merchant.

The "on your own”' part is also not valid. Lot's of agencies thrive by implementing the open source software platforms mentioned above and maintaining it for merchants (whether that's hosted on-premise or through specialized hosting services or even on SaaS platforms).

Of course it is very true that when you compare software that you host on your own servers versus a SaaS or a PaaS solution that the latter will "release" you as the merchants from a lot of work in deploying/running/managing the software. You basically outsource that responsibility to the vendor and that's why you pay them a monthly fee.

### ***"Open source by definition is versioned."***

No, that’s not in the definition of “Open Source”. But yes: unless the piece of software was released once and never been updated or maintained it probably is versioned. As is all software: this has nothing to do with the software being open source.

From a customer point of view, most SaaS offerings are indeed "versionless": you still get new versions and there is no work from your side and new features of bugfixes just seem to appear. And most of the time, all customers will be on the same version, which means much less maintenance for the vendor.

This is not a flawless system as APIs might be updated/created/deprecated along the way, but obviously requires much less from the merchant compared to any self-hosted software (including but not limited to open source).

### ***"As new updates are available, you have to deploy/manage them yourself. Urgent security patch? You need to apply and deploy immediately. Yourself"***

That’s your choice: you can probably use services provided by either the software vendor itself, use an agency in their ecosystem or indeed deploy/manage these yourself. Not every piece of open software will have a software vendor or agencies to do this for you, but the popular open source commerce platforms do.

Many (open source and other) platforms have semi-automated or even fully automated update features, like Spryker and Woocommerce do. And yes: clicking a couple buttons is more work then the automagic updates that SaaS products provide, but ass long as you follow the coding standards, updating your system has just a minor impact on your overall workload in maintaining those systems.

And in case you add (a lot of) custom code or external services to your SaaS service, like for example a VueJS or React frontend, you will still have this update “problem”, maybe not for your core commerce product, but you do for any customizations.

So whichever way you go: at the end of the day someone needs to deal with updates to parts of the system. At least when the code is open, things are visible and as a merchant you can have control if you want to.

When using PaaS/SaaS you replace that control with trusting and external party to do so which some merchants don’t like to do. Your SaaS provider might just as well have many unpatched systems running, you’re just not made aware of it (until things go horribly wrong). Is that inherently better…?

### ***"Open source is most likely to be monolithic in nature…"***

I don’t know about the statistics of this. But since open source has been around for a long time and non-monolithic commerce platforms are relatively new this is probably true. But again this applies when you consider **all** software and **all** commerce platforms and this is **not** an inherent feature of open source.

### ***"...because you wouldn't want a large community to have to run dozens of individual microservices"***

If a good functioning community can maintain a big monolithic system, I don’t see why they couldn’t maintain a system based on microservices. Since everything is decoupled I would actually argue it’s easier, because all functions are isolated and you don't have to always keep thinking about the impact you might have on the system as a whole.

And that's again not a hypothetical: lot of people **do** maintain microservices. But exactly **because** these are ***micro***services, you don’t register these as “a large community that runs dozens of individual microservices”.

But that doesn't mean it doesn't happen: there’s [Docker](https://www.docker.com/), [Terraform](https://www.terraform.io/), [K8 helm charts](https://helm.sh/) and more tools that facilitate this.

So this actually already happens. A lot.

### ***”Open source requires that you layer your updates over the top of the code, thereby tightly coupling your code to the open source code”***

This seems to be more of a monolithic versus decoupled/microservices argument. There’s some truth in this statement in that case, but again has nothing to do with the code being open source.

### ***"There's no incentive for an open source community to build a big multi tenant SaaS application for a vendor to run."***

We have Wordpress/WooCommerce, Shopware, Akeneo and Spryker to prove this wrong. Open source projects don't have to be run by a community of volunteer developers that have no incentive to do so: These open source projects are all backed or simply run by companies that apparently have enough incentive to do so.

## Recap

So I hope this gives some clarity. If you need more clarification on some of the explanations above or have your own thoughts about this? Put them in the comments!

## Next time...

...I'll post an article on the "Commerce is a Commodity" versus "Commerce is Custom" movements.

*PS: if you want to read more about this, Sander Mangel also published an article about this topic today titled ["Why SaaS vs. Open Source doesn’t have a clear cut answer"](https://www.linkedin.com/pulse/why-saas-vs-open-source-doesnt-have-clear-cut-answer-sander-mangel/?published=t) and I highly recommend you give that a read.*

‍
`,i={title:" Often Confused Commerce Terms ",description:"Lets set the record straight about some often mixed up terms in commerce",authors:[{slug:"gxjansen",collection:"authors"}],pubDate:new Date(16473024e5),heroImage:new Proxy({src:"/astro-assets/heroImage.CTG2Wt01.png",width:1040,height:584,format:"png",fsPath:"/Users/gxjansen/Documents/GitHub/gxjansen.github.io/src/content/blog/en/often-confused-commerce-terms/heroImage.png"},{get(t,e,o){return e==="clone"?structuredClone(t):e==="fsPath"?"/Users/gxjansen/Documents/GitHub/gxjansen.github.io/src/content/blog/en/often-confused-commerce-terms/heroImage.png":t[e]}}),categories:["Open Source","Spryker"],draft:!1},c={type:"content",filePath:"/Users/gxjansen/Documents/GitHub/gxjansen.github.io/src/content/blog/en/often-confused-commerce-terms/index.mdx",rawData:void 0};export{c as _internal,r as body,a as collection,i as data,n as id,s as slug};
