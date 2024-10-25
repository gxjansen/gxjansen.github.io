export interface Event {
    name: string;
    icon: string;
    date: Date;
    city: string;
    country: string;
    url: string;
    isWorkshop: boolean;
    presentationUrl?: string;
}

// Export the events array with explicit typing
export const events: Event[] = [
    {
        name: "AstroConf 2024",
        icon: "astroconf.png",
        date: new Date("2024-03-15"),
        city: "Amsterdam",
        country: "NL",
        url: "https://astroconf.com",
        isWorkshop: true
    },
    // Add more events here...
];