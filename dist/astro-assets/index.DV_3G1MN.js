import{c as t}from"./Admonition.DdfWBigK.js";import{F as r,$ as a}from"./keystatic-page.CX2dnrWP.js";import"./___vite-browser-external_commonjs-proxy.B2SwpVhP.js";import"./_commonjsHelpers.C4iS2aBk.js";import"./index.zSnisxZ3.js";/* empty css                               */import"./astro/assets-service.CJMMCYvq.js";const l={src:"/astro-assets/Proving A-B Testing Value.D7pXQ1Ei.png",width:1376,height:1492,format:"png"},h={title:"Proving the monetary value of A/B testing",description:"How to go from “4% conversion uplift” to “€636K — €854K extra profit this year”",draft:!1,authors:["gxjansen"],pubDate:"2017-07-28T00:00:00.000Z",heroImage:"../proving-the-monetary-value-of-a-b-testing/heroImage.jpeg",categories:["Archive","Experimentation"]};function b(){return[{depth:3,slug:"1-calculate-the-extra-profit-by-just-running-this-single-abtest",text:"1) Calculate the extra profit by just running this single A/B test"},{depth:3,slug:"2a-increase-the-baseline-12-month-prediction",text:"2A) Increase the baseline 12 month prediction"},{depth:3,slug:"2b-make-some-corrections",text:"2B) Make some corrections"},{depth:3,slug:"try-it-yourself",text:"Try it yourself!"},{depth:3,slug:"write-down-your-assumptions",text:"Write down your assumptions"},{depth:3,slug:"dont-do-this-on-your-own-getbuy-in",text:"Don’t do this on your own, get buy-in"},{depth:3,slug:"some-finalremarks",text:"Some final remarks"}]}const w=!0;function i(n){const e={a:"a","astro-image":"astro-image",br:"br",em:"em",h3:"h3",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...n.components},s=e["astro-image"];return t(r,{children:[t(e.p,{children:"How to go from “4% conversion uplift” to “€636K — €854K extra profit this year”. Example calculation sheet included!"}),`
`,t(e.p,{children:"I’ve created a method to calculate the impact of A/B testing in terms of yearly profit. And not unimportant: this has been accepted by the whole company. This method isn’t perfect, but it gives you as a CRO manager quite some power to prove the effect of your team."}),`
`,t(e.p,{children:"The prerequisites to do this:"}),`
`,t(e.ul,{children:[`
`,t(e.li,{children:[`
`,t(e.p,{children:"showing what you normally would expect to get in terms of traffic, number of orders and average revenue (or even average profit) per order for the next 12 months. If you don’t have this, you could take data of the past 12 months as an alternative baseline."}),`
`]}),`
`,t(e.li,{children:[`
`,t(e.p,{children:["You ran some ",t(e.strong,{children:"successful A/B test"})," :)."]}),`
`]}),`
`]}),`
`,t(e.p,{children:t(e.em,{children:"* I take 12 months so I don’t have to worry about any seasonal effects."})}),`
`,t(e.p,{children:"Our BI/Finance team can already provide me with the baseline prediction (based on current numbers and including predictions on competitors, market changes, investments etc. etc.) so I don’t have to worry about that. Of course we also have some successful A/B tests at our disposal."}),`
`,t(e.p,{children:"Now I can perform these steps:"}),`
`,t(e.ol,{children:[`
`,t(e.li,{children:[`
`,t(e.p,{children:"Calculate the extra profit by just running this single A/B test."}),`
`]}),`
`,t(e.li,{children:[`
`,t(e.p,{children:"Prediction/extrapolation: A) Increase the baseline 12 month prediction with the changes in conversion rate and/or average order value proven by the test.B) Make some corrections on A) to make sure you’re not overselling yourself."}),`
`]}),`
`]}),`
`,t(e.h3,{id:"1-calculate-the-extra-profit-by-just-running-this-single-abtest",children:t(e.strong,{children:"1) Calculate the extra profit by just running this single A/B test"})}),`
`,t(e.p,{children:"This is just a simple calculation only based on your A/B test data. You calculate the revenue (or better: profit) from your original variant and all other variants. Then you calculate the difference if you would have had the original running 100% versus running the test with all your variants."}),`
`,t(e.p,{children:"This works for all tests (successful or not) and tells you if you made any loss/gain during the test itself. Of course you only implement the winner, but if you test multiple variants it could be that the net result during the testing period is negative. This helps you to get a grip on the monetary cost/risk of performing A/B test."}),`
`,t(e.h3,{id:"2a-increase-the-baseline-12-month-prediction",children:t(e.strong,{children:"2A) Increase the baseline 12 month prediction"})}),`
`,t(e.p,{children:"This one is actually quite simple: you take your prediction (we have it on a day-by-day basis) and apply the changes in conversion rate and average order value that we saw in the test."}),`
`,t(e.h3,{id:"2b-make-some-corrections",children:t(e.strong,{children:"2B) Make some corrections"})}),`
`,t(e.p,{children:"Now this is where it gets tricky. 2A) will get you a very precise (and usually quite high) number which I feel will need some corrections (downwards) to make it realistic. I also prefer to put it in a range instead of just one single number."}),`
`,t(e.p,{children:"Some of the assumptions/corrections I do:"}),`
`,t(e.ul,{children:[`
`,t(e.li,{children:[`
`,t(e.p,{children:["I assume a diminishing effect per month. I’ve set this to 2% which means",t(e.br,{}),`
that after a full year, you will only have 78% of the original effect`,t(e.br,{}),`
left.`]}),`
`]}),`
`,t(e.li,{children:[`
`,t(e.p,{children:["When I do a test in a single or just a couple of countries, I always assume",t(e.br,{}),`
the effect will be less when applied in other countries. In the same`,t(e.br,{}),`
region I’ve set this to 25%, for countries outside the tested region`,t(e.br,{}),`
this is set to 50% (this is not included in the example sheet below).`]}),`
`]}),`
`,t(e.li,{children:[`
`,t(e.p,{children:["A correction for the significance level (we test at 95%). This correction",t(e.br,{}),`
makes no sense when applied to one test, but when you do this for all`,t(e.br,{}),`
experiments that you implement, you can assume a certain part (around`,t(e.br,{}),`
23%,`]}),`
`]}),`
`]}),`
`,t(e.p,{children:"After all corrections I turn the single number that comes out of this equation into the upper limit of a range and subtract a percentage to get to a lower limit. For a country this is 20%, when applied to the same region it’s 40% and for the rest of the group this is 50%. All arbitrary numbers."}),`
`,t(e.p,{children:["And the result of all this? Instead of saying ",t(e.em,{children:"“we have improved conversion by 4%”"})," I can now claim ",t(e.em,{children:"“after implementation this test gives us €636K — €854K extra profit this year”"}),"."]}),`
`,t(e.h3,{id:"try-it-yourself",children:t(e.strong,{children:"Try it yourself!"})}),`
`,t(e.p,{children:"For obvious reasons I can’t share our own internal sheet (containing our complete budget), but I made a simplified version in Google Sheets that should make the basic calculations clear:"}),`
`,t(e.p,{children:t(s,{alt:"",src:l})}),`
`,t(e.p,{children:t(e.a,{href:"https://docs.google.com/spreadsheets/d/10yG3lzoBMZG0Zw613qZiEdYToWc287FfQXCt_d-1MZs/edit?usp=sharing",children:t(e.em,{children:"Example of the calculation sheet"})})}),`
`,t(e.p,{children:"Let me know if you think some things are off or if you have any improvements."}),`
`,t(e.h3,{id:"write-down-your-assumptions",children:t(e.strong,{children:"Write down your assumptions"})}),`
`,t(e.p,{children:"I highly recommend writing down all your assumptions in your calculation sheet. You will need to make quite some of them to make this work and writing it down makes it tangible and easier to adjust afterwards if you have more data to update your assumptions and the calculations based on them."}),`
`,t(e.p,{children:"Some more written down assumptions I have in my sheet:"}),`
`,t(e.ul,{children:[`
`,t(e.li,{children:[`
`,t(e.p,{children:["We",t(e.br,{}),`
work across 12 countries with different currencies while the budget predictions are all int he same currency. Changes in exchange rates will not be taken into account.`]}),`
`]}),`
`,t(e.li,{children:[`
`,t(e.p,{children:"During A/B tests we optimize for CR and AOV but the testing system cannot optimize for profit (technical limitation). Profit is a percentage of AOV but this is different for different countries and different products. This calculation assumes a stable relation between AOV and profit which is the best we can do right now."}),`
`]}),`
`]}),`
`,t(e.p,{children:"This also helps when sharing this sheet internally because: buy-in!"}),`
`,t(e.h3,{id:"dont-do-this-on-your-own-getbuy-in",children:t(e.strong,{children:"Don’t do this on your own, get buy-in"})}),`
`,t(e.p,{children:"Now I didn’t build this sheet on my own: I also got our business analyst and our financial controller involved to check the numbers, the calculations and all assumptions. They helped improving the sheet to match how finance calculate numbers and to get an official stamp of approval."}),`
`,t(e.h3,{id:"some-finalremarks",children:t(e.strong,{children:"Some final remarks"})}),`
`,t(e.p,{children:"Of course this is just a prediction and even in hindsight after 12 months you will not be able to calculate if the changes in your numbers were a result of your A/B test implementation."}),`
`,t(e.p,{children:"This fact means it still feels a bit weird to me to do such a prediction. But because we made this together with BI/Finance this is currently the best way we have to quantify the effect of our experiments. It also provide us with a way to compare our experiments."}),`
`,t(e.p,{children:"But the best reason to do this is that it works really well. Putting a dollar sign in your experiment reports makes a lot more people interested in the results and helps you to increase your budget."})]})}function c(n={}){const{wrapper:e}=n.components||{};return e?t(e,{...n,children:t(i,{...n})}):i(n)}const v="src/content/blog/en/proving-the-monetary-value-of-a-b-testing/index.mdx",x="/Users/gxjansen/Documents/GitHub/gxjansen.github.io/src/content/blog/en/proving-the-monetary-value-of-a-b-testing/index.mdx",o=(n={})=>c({...n,components:{Fragment:r,...n.components,"astro-image":n.components?.img??a}});o[Symbol.for("mdx-component")]=!0;o[Symbol.for("astro.needsHeadRendering")]=!h.layout;o.moduleId="/Users/gxjansen/Documents/GitHub/gxjansen.github.io/src/content/blog/en/proving-the-monetary-value-of-a-b-testing/index.mdx";export{o as Content,w as __usesAstroImage,o as default,x as file,h as frontmatter,b as getHeadings,v as url};
