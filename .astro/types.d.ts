declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"authors": {
"gxjansen/index.mdx": {
	id: "gxjansen/index.mdx";
  slug: "gxjansen";
  body: string;
  collection: "authors";
  data: InferEntrySchema<"authors">
} & { render(): Render[".mdx"] };
};
"blog": {
"best-vscode-extensions-front-end-developers/index.mdx": {
	id: "best-vscode-extensions-front-end-developers/index.mdx";
  slug: "best-vscode-extensions-front-end-developers";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"en/999999999/index.mdx": {
	id: "en/999999999/index.mdx";
  slug: "en/999999999";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"en/are-you-left-or-right-brain-surprise-youre-both/index.mdx": {
	id: "en/are-you-left-or-right-brain-surprise-youre-both/index.mdx";
  slug: "en/are-you-left-or-right-brain-surprise-youre-both";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"en/can-you-afford-not-to-know-can-you-afford-to-be-wrong/index.mdx": {
	id: "en/can-you-afford-not-to-know-can-you-afford-to-be-wrong/index.mdx";
  slug: "en/can-you-afford-not-to-know-can-you-afford-to-be-wrong";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"en/compute-required-sample-size-for-your-ab-tests/index.mdx": {
	id: "en/compute-required-sample-size-for-your-ab-tests/index.mdx";
  slug: "en/compute-required-sample-size-for-your-ab-tests";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"en/first-episode-of-cro-cafe-is-live/index.mdx": {
	id: "en/first-episode-of-cro-cafe-is-live/index.mdx";
  slug: "en/first-episode-of-cro-cafe-is-live";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"en/intervju-guido-jansen-ska-ta-reda-pa-varfor-kunderna-inte-handlar/index.mdx": {
	id: "en/intervju-guido-jansen-ska-ta-reda-pa-varfor-kunderna-inte-handlar/index.mdx";
  slug: "en/intervju-guido-jansen-ska-ta-reda-pa-varfor-kunderna-inte-handlar";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"en/new-domain-and-cms/index.mdx": {
	id: "en/new-domain-and-cms/index.mdx";
  slug: "en/new-domain-and-cms";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"en/nieuwe-website-online/index.mdx": {
	id: "en/nieuwe-website-online/index.mdx";
  slug: "en/nieuwe-website-online";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"en/often-confused-commerce-terms/index.mdx": {
	id: "en/often-confused-commerce-terms/index.mdx";
  slug: "en/often-confused-commerce-terms";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"en/one-year-com-in-retrospect/index.mdx": {
	id: "en/one-year-com-in-retrospect/index.mdx";
  slug: "en/one-year-com-in-retrospect";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"en/optimization-hierarchy-of-evidence/index.mdx": {
	id: "en/optimization-hierarchy-of-evidence/index.mdx";
  slug: "en/optimization-hierarchy-of-evidence";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"en/proving-the-monetary-value-of-a-b-testing/index.mdx": {
	id: "en/proving-the-monetary-value-of-a-b-testing/index.mdx";
  slug: "en/proving-the-monetary-value-of-a-b-testing";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"en/recording-creating-an-optimization-culture/index.mdx": {
	id: "en/recording-creating-an-optimization-culture/index.mdx";
  slug: "en/recording-creating-an-optimization-culture";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"en/texas-sharpshooter-fallacy/index.mdx": {
	id: "en/texas-sharpshooter-fallacy/index.mdx";
  slug: "en/texas-sharpshooter-fallacy";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"en/the-cro-process/index.mdx": {
	id: "en/the-cro-process/index.mdx";
  slug: "en/the-cro-process";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"en/the-story-of-spryker-with-ceo-boris-lokschin/index.mdx": {
	id: "en/the-story-of-spryker-with-ceo-boris-lokschin/index.mdx";
  slug: "en/the-story-of-spryker-with-ceo-boris-lokschin";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"en/top-tips-for-getting-started-in-ecommerce/index.mdx": {
	id: "en/top-tips-for-getting-started-in-ecommerce/index.mdx";
  slug: "en/top-tips-for-getting-started-in-ecommerce";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"en/website-move-to-webflow/index.mdx": {
	id: "en/website-move-to-webflow/index.mdx";
  slug: "en/website-move-to-webflow";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"en/website-moved-to-astro/index.mdx": {
	id: "en/website-moved-to-astro/index.mdx";
  slug: "en/website-moved-to-astro";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"en/website-online/index.mdx": {
	id: "en/website-online/index.mdx";
  slug: "en/website-online";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"example-1/index.mdx": {
	id: "example-1/index.mdx";
  slug: "example-1";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"example-2/index.mdx": {
	id: "example-2/index.mdx";
  slug: "example-2";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"tailwind-gradient-underline/index.mdx": {
	id: "tailwind-gradient-underline/index.mdx";
  slug: "tailwind-gradient-underline";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"tips-for-freelance-website-development/index.mdx": {
	id: "tips-for-freelance-website-development/index.mdx";
  slug: "tips-for-freelance-website-development";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"tsconfig-paths-setup/index.mdx": {
	id: "tsconfig-paths-setup/index.mdx";
  slug: "tsconfig-paths-setup";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
};
"otherPages": {
"elements/index.mdx": {
	id: "elements/index.mdx";
  slug: "elements";
  body: string;
  collection: "otherPages";
  data: InferEntrySchema<"otherPages">
} & { render(): Render[".mdx"] };
"privacy-policy/index.mdx": {
	id: "privacy-policy/index.mdx";
  slug: "privacy-policy";
  body: string;
  collection: "otherPages";
  data: InferEntrySchema<"otherPages">
} & { render(): Render[".mdx"] };
"terms/index.mdx": {
	id: "terms/index.mdx";
  slug: "terms";
  body: string;
  collection: "otherPages";
  data: InferEntrySchema<"otherPages">
} & { render(): Render[".mdx"] };
};
"services": {
"deck-and-fence-staining/index.mdx": {
	id: "deck-and-fence-staining/index.mdx";
  slug: "deck-and-fence-staining";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".mdx"] };
"exterior-painting/index.mdx": {
	id: "exterior-painting/index.mdx";
  slug: "exterior-painting";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".mdx"] };
"interior-painting/index.mdx": {
	id: "interior-painting/index.mdx";
  slug: "interior-painting";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".mdx"] };
};

	};

	type DataEntryMap = {
		"countries": {
"argentina/index": {
	id: "argentina/index";
  collection: "countries";
  data: InferEntrySchema<"countries">
};
"austria/index": {
	id: "austria/index";
  collection: "countries";
  data: InferEntrySchema<"countries">
};
"belarus/index": {
	id: "belarus/index";
  collection: "countries";
  data: InferEntrySchema<"countries">
};
"belgium/index": {
	id: "belgium/index";
  collection: "countries";
  data: InferEntrySchema<"countries">
};
"brazil/index": {
	id: "brazil/index";
  collection: "countries";
  data: InferEntrySchema<"countries">
};
"china/index": {
	id: "china/index";
  collection: "countries";
  data: InferEntrySchema<"countries">
};
"croatia/index": {
	id: "croatia/index";
  collection: "countries";
  data: InferEntrySchema<"countries">
};
"czech-republic/index": {
	id: "czech-republic/index";
  collection: "countries";
  data: InferEntrySchema<"countries">
};
"denmark/index": {
	id: "denmark/index";
  collection: "countries";
  data: InferEntrySchema<"countries">
};
"estonia/index": {
	id: "estonia/index";
  collection: "countries";
  data: InferEntrySchema<"countries">
};
"france/index": {
	id: "france/index";
  collection: "countries";
  data: InferEntrySchema<"countries">
};
"germany/index": {
	id: "germany/index";
  collection: "countries";
  data: InferEntrySchema<"countries">
};
"great-britain/index": {
	id: "great-britain/index";
  collection: "countries";
  data: InferEntrySchema<"countries">
};
"greece/index": {
	id: "greece/index";
  collection: "countries";
  data: InferEntrySchema<"countries">
};
"indonesia/index": {
	id: "indonesia/index";
  collection: "countries";
  data: InferEntrySchema<"countries">
};
"ireland/index": {
	id: "ireland/index";
  collection: "countries";
  data: InferEntrySchema<"countries">
};
"italy/index": {
	id: "italy/index";
  collection: "countries";
  data: InferEntrySchema<"countries">
};
"norway/index": {
	id: "norway/index";
  collection: "countries";
  data: InferEntrySchema<"countries">
};
"poland/index": {
	id: "poland/index";
  collection: "countries";
  data: InferEntrySchema<"countries">
};
"romania/index": {
	id: "romania/index";
  collection: "countries";
  data: InferEntrySchema<"countries">
};
"singapore/index": {
	id: "singapore/index";
  collection: "countries";
  data: InferEntrySchema<"countries">
};
"spain/index": {
	id: "spain/index";
  collection: "countries";
  data: InferEntrySchema<"countries">
};
"sweden/index": {
	id: "sweden/index";
  collection: "countries";
  data: InferEntrySchema<"countries">
};
"switserland/index": {
	id: "switserland/index";
  collection: "countries";
  data: InferEntrySchema<"countries">
};
"the-netherlands/index": {
	id: "the-netherlands/index";
  collection: "countries";
  data: InferEntrySchema<"countries">
};
"ukraine/index": {
	id: "ukraine/index";
  collection: "countries";
  data: InferEntrySchema<"countries">
};
"united-states/index": {
	id: "united-states/index";
  collection: "countries";
  data: InferEntrySchema<"countries">
};
"vietnam/index": {
	id: "vietnam/index";
  collection: "countries";
  data: InferEntrySchema<"countries">
};
"world/index": {
	id: "world/index";
  collection: "countries";
  data: InferEntrySchema<"countries">
};
};
"events": Record<string, {
  id: string;
  collection: "events";
  data: InferEntrySchema<"events">;
}>;

	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("../src/content/config.js");
}
