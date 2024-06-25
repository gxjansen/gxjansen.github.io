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
"second-author/index.mdx": {
	id: "second-author/index.mdx";
  slug: "second-author";
  body: string;
  collection: "authors";
  data: InferEntrySchema<"authors">
} & { render(): Render[".mdx"] };
"web-reaper/index.mdx": {
	id: "web-reaper/index.mdx";
  slug: "web-reaper";
  body: string;
  collection: "authors";
  data: InferEntrySchema<"authors">
} & { render(): Render[".mdx"] };
};
"blog": {
"en/best-vscode-extensions-front-end-developers/index.mdx": {
	id: "en/best-vscode-extensions-front-end-developers/index.mdx";
  slug: "en/best-vscode-extensions-front-end-developers";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"en/example-1/index.mdx": {
	id: "en/example-1/index.mdx";
  slug: "en/example-1";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"en/example-2/index.mdx": {
	id: "en/example-2/index.mdx";
  slug: "en/example-2";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"en/example-3/index.mdx": {
	id: "en/example-3/index.mdx";
  slug: "en/example-3";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"en/tailwind-gradient-underline/index.mdx": {
	id: "en/tailwind-gradient-underline/index.mdx";
  slug: "en/tailwind-gradient-underline";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"en/tsconfig-paths-setup/index.mdx": {
	id: "en/tsconfig-paths-setup/index.mdx";
  slug: "en/tsconfig-paths-setup";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"fr/best-vscode-extensions-front-end-developers/index.mdx": {
	id: "fr/best-vscode-extensions-front-end-developers/index.mdx";
  slug: "fr/best-vscode-extensions-front-end-developers";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"fr/example-1/index.mdx": {
	id: "fr/example-1/index.mdx";
  slug: "fr/example-1";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"fr/example-2/index.mdx": {
	id: "fr/example-2/index.mdx";
  slug: "fr/example-2";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"fr/example-3/index.mdx": {
	id: "fr/example-3/index.mdx";
  slug: "fr/example-3";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"fr/tailwind-gradient-underline/index.mdx": {
	id: "fr/tailwind-gradient-underline/index.mdx";
  slug: "fr/tailwind-gradient-underline";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"fr/tsconfig-paths-setup/index.mdx": {
	id: "fr/tsconfig-paths-setup/index.mdx";
  slug: "fr/tsconfig-paths-setup";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
};
"otherPages": {
"en/elements/index.mdx": {
	id: "en/elements/index.mdx";
  slug: "en/elements";
  body: string;
  collection: "otherPages";
  data: InferEntrySchema<"otherPages">
} & { render(): Render[".mdx"] };
"en/privacy-policy/index.mdx": {
	id: "en/privacy-policy/index.mdx";
  slug: "en/privacy-policy";
  body: string;
  collection: "otherPages";
  data: InferEntrySchema<"otherPages">
} & { render(): Render[".mdx"] };
"en/terms/index.mdx": {
	id: "en/terms/index.mdx";
  slug: "en/terms";
  body: string;
  collection: "otherPages";
  data: InferEntrySchema<"otherPages">
} & { render(): Render[".mdx"] };
"fr/elements/index.mdx": {
	id: "fr/elements/index.mdx";
  slug: "fr/elements";
  body: string;
  collection: "otherPages";
  data: InferEntrySchema<"otherPages">
} & { render(): Render[".mdx"] };
"fr/privacy-policy/index.mdx": {
	id: "fr/privacy-policy/index.mdx";
  slug: "fr/privacy-policy";
  body: string;
  collection: "otherPages";
  data: InferEntrySchema<"otherPages">
} & { render(): Render[".mdx"] };
"fr/terms/index.mdx": {
	id: "fr/terms/index.mdx";
  slug: "fr/terms";
  body: string;
  collection: "otherPages";
  data: InferEntrySchema<"otherPages">
} & { render(): Render[".mdx"] };
};
"services": {
"en/deck-and-fence-staining/index.mdx": {
	id: "en/deck-and-fence-staining/index.mdx";
  slug: "en/deck-and-fence-staining";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".mdx"] };
"en/exterior-painting/index.mdx": {
	id: "en/exterior-painting/index.mdx";
  slug: "en/exterior-painting";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".mdx"] };
"en/interior-painting/index.mdx": {
	id: "en/interior-painting/index.mdx";
  slug: "en/interior-painting";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".mdx"] };
"fr/deck-and-fence-staining/index.mdx": {
	id: "fr/deck-and-fence-staining/index.mdx";
  slug: "fr/deck-and-fence-staining";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".mdx"] };
"fr/exterior-painting/index.mdx": {
	id: "fr/exterior-painting/index.mdx";
  slug: "fr/exterior-painting";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".mdx"] };
"fr/interior-painting/index.mdx": {
	id: "fr/interior-painting/index.mdx";
  slug: "fr/interior-painting";
  body: string;
  collection: "services";
  data: InferEntrySchema<"services">
} & { render(): Render[".mdx"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("../src/content/config.js");
}
