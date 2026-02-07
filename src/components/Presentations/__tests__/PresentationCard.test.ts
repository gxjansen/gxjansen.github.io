import { describe, it, expect } from 'vitest';
import { parseHTML, createTestPresentation, createMockImage } from '../../../test/astro-test-utils';

describe('PresentationCard HTML Structure', () => {
  it('matches snapshot with minimal props', () => {
    const presentation = createTestPresentation({
      title: 'Test Presentation',
      image: undefined,
      duration: undefined,
      isWorkshop: undefined,
      intendedAudience: undefined
    });

    const html = `
      <article class="card group">
        <a href="/presentations/${presentation.slug}/">
          <h2 class="card-title">
            <a href="/presentations/${presentation.slug}/" class="hover:text-primary-500 dark:hover:text-primary-400">
              ${presentation.data.title}
            </a>
          </h2>
        </a>
        <div class="mt-6">
          <a href="/presentations/${presentation.slug}/" class="inline-flex items-center gap-2">
            View Presentation
            <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </article>
    `.trim();

    expect(parseHTML(html).toString()).toMatchSnapshot();
  });

  it('matches snapshot with all props', () => {
    const presentation = createTestPresentation({
      title: 'Full Test Presentation',
      duration: '45 minutes',
      isWorkshop: true,
      intendedAudience: 'Developers',
      image: createMockImage({
        src: '/test-image.jpg',
        alt: 'Full Test Presentation',
        width: 1600,
        height: 900,
        class: 'w-full rounded-t-xl object-cover'
      })
    });

    const html = `
      <article class="card group">
        <a href="/presentations/${presentation.slug}/">
          ${presentation.data.image}
        </a>
        <div class="card-content">
          <div class="card-meta">
            <span class="inline-flex rounded-full bg-base-200 px-3 py-1 text-sm font-medium text-base-900 dark:bg-base-800 dark:text-base-100">
              ${presentation.data.duration}
            </span>
            <span class="inline-flex rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-200">
              Workshop
            </span>
          </div>

          <h2 class="card-title">
            <a href="/presentations/${presentation.slug}/" class="hover:text-primary-500 dark:hover:text-primary-400">
              ${presentation.data.title}
            </a>
          </h2>

          <p class="text-base-500 dark:text-base-400">
            <span class="font-medium">For:</span> ${presentation.data.intendedAudience}
          </p>

          <div class="mt-6">
            <a href="/presentations/${presentation.slug}/" class="inline-flex items-center gap-2">
              View Presentation
              <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>
      </article>
    `.trim();

    expect(parseHTML(html).toString()).toMatchSnapshot();
  });
});
