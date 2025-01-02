import type { Event } from '../../../utils/eventUtils';

export const mockImageMetadata = {
  src: '/src/images/events/test1.png',
  width: 100,
  height: 100,
  format: 'png'
};

export const mockEvents: Omit<Event, 'loadedIcon'>[] = [
  {
    id: '1',
    name: 'Test Event 1',
    date: '2024-06-01',
    city: 'Amsterdam',
    country: 'NL',
    topic: 'Testing',
    role: 'Speaker',
    workshop: false,
    icon: 'test1.png',
    relatedPresentationSlugs: ['test-pres-1']
  },
  {
    id: '2',
    name: 'Test Event 2',
    date: '2024-07-01',
    city: 'Rotterdam',
    country: 'NL',
    topic: 'Development',
    role: 'Speaker',
    workshop: true,
    icon: 'test2.png',
    relatedPresentationSlugs: []
  }
];

export const mockEventsData = [
  {
    id: '1',
    name: 'Past Event',
    date: '2023-01-01',
    city: 'Test City',
    country: 'TC',
    topic: 'Testing',
    role: 'Speaker',
    workshop: false,
    relatedPresentationSlugs: []
  },
  {
    id: '2',
    name: 'Future Event',
    date: '2025-01-01',
    city: 'Test City',
    country: 'TC',
    topic: 'Testing',
    role: 'Speaker',
    workshop: false,
    relatedPresentationSlugs: []
  }
];

export const getEventIcon = async (iconName?: string) => {
  if (!iconName) return null;
  const iconPath = `/src/images/events/${iconName}`;
  return iconPath.includes('test1.png') || iconPath.includes('test2.png') 
    ? mockImageMetadata 
    : null;
};

export const loadEventIcons = async (events: any[]) => {
  return Promise.all(
    events.map(async (event) => ({
      ...event,
      loadedIcon: event.icon ? mockImageMetadata : null
    }))
  );
};

export const getAllEvents = async () => {
  return Promise.all(
    mockEventsData.map(async (event) => ({
      ...event,
      loadedIcon: null
    }))
  );
};

export const getTotalPastEventsCount = () => {
  const today = new Date();
  return mockEventsData.filter(event => new Date(event.date) < today).length;
};
