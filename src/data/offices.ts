import type { Country } from '../lib/country';
import type { Text } from './fiscal-calendar/types';

/**
 * One office per country, in its largest city (fictional company). Real central streets; no
 * specific walking times except in Zurich, where the site already gives them.
 */
export interface Office {
  street: string;
  postalCode: string;
  /** City as written in the country's postal address. */
  city: string;
  title: Text;
  text: Text;
  /** City name in each language ("Visit us in Zurich."). */
  cityName: Text;
  /** Stylised map: station, office street and a landmark (lake, river or park). */
  station: string;
  streetLabel: string;
  landmark: Text;
  landmarkKind: 'water' | 'park';
  /** Walking minutes from the station, only where we give them (Zurich). */
  walkMinutes?: number;
  directions: Text;
}

export const OFFICES: Record<Country, Office> = {
  CH: {
    cityName: { es: 'Zúrich', en: 'Zurich', de: 'Zürich', fr: 'Zurich', it: 'Zurigo' },
    station: 'Stadelhofen',
    streetLabel: 'Seefeldstrasse',
    landmark: {
      es: 'Lago de Zúrich',
      en: 'Lake Zurich',
      de: 'Zürichsee',
      fr: 'Lac de Zurich',
      it: 'Lago di Zurigo',
    },
    landmarkKind: 'water',
    walkMinutes: 6,
    directions: {
      es: 'A 6 minutos a pie de la estación de Stadelhofen.',
      en: 'A 6-minute walk from Stadelhofen station.',
      de: '6 Minuten zu Fuss vom Bahnhof Stadelhofen.',
      fr: 'À 6 minutes à pied de la gare de Stadelhofen.',
      it: 'A 6 minuti a piedi dalla stazione di Stadelhofen.',
    },
    street: 'Seefeldstrasse 45',
    postalCode: '8008',
    city: 'Zürich',
    title: {
      es: 'En Seefeld, junto al lago.',
      en: 'In Seefeld, by the lake.',
      de: 'Im Seefeld, nahe am See.',
      fr: 'À Seefeld, près du lac.',
      it: 'A Seefeld, vicino al lago.',
    },
    text: {
      es: 'Estamos a seis minutos a pie de la estación de Stadelhofen. Si prefieres hablar en persona, te recibimos aquí.',
      en: 'Six minutes on foot from Stadelhofen station. If you prefer to talk in person, we welcome you here.',
      de: 'Sechs Gehminuten vom Bahnhof Stadelhofen. Wenn du lieber persönlich sprichst, empfangen wir dich hier.',
      fr: 'À six minutes à pied de la gare de Stadelhofen. Si vous préférez parler en personne, nous vous recevons ici.',
      it: 'A sei minuti a piedi dalla stazione di Stadelhofen. Se preferisci parlare di persona, ti accogliamo qui.',
    },
  },
  ES: {
    cityName: { es: 'Madrid', en: 'Madrid', de: 'Madrid', fr: 'Madrid', it: 'Madrid' },
    station: 'Serrano',
    streetLabel: 'Calle de Serrano',
    landmark: {
      es: 'Parque del Retiro',
      en: 'Retiro Park',
      de: 'Retiro-Park',
      fr: 'Parc du Retiro',
      it: 'Parco del Retiro',
    },
    landmarkKind: 'park',
    directions: {
      es: 'A pocos minutos a pie del metro Serrano.',
      en: 'A few minutes on foot from Serrano metro station.',
      de: 'Wenige Gehminuten von der Metrostation Serrano.',
      fr: 'À quelques minutes à pied du métro Serrano.',
      it: 'A pochi minuti a piedi dalla metro Serrano.',
    },
    street: 'Calle de Serrano 45',
    postalCode: '28001',
    city: 'Madrid',
    title: {
      es: 'En el barrio de Salamanca.',
      en: 'In the Salamanca district.',
      de: 'Im Viertel Salamanca.',
      fr: 'Dans le quartier de Salamanca.',
      it: 'Nel quartiere di Salamanca.',
    },
    text: {
      es: 'Estamos a pocos minutos a pie del metro Serrano. Si prefieres hablar en persona, te recibimos aquí.',
      en: 'A few minutes on foot from Serrano metro station. If you prefer to talk in person, we welcome you here.',
      de: 'Wenige Gehminuten von der Metrostation Serrano. Wenn du lieber persönlich sprichst, empfangen wir dich hier.',
      fr: 'À quelques minutes à pied du métro Serrano. Si vous préférez parler en personne, nous vous recevons ici.',
      it: 'A pochi minuti a piedi dalla metro Serrano. Se preferisci parlare di persona, ti accogliamo qui.',
    },
  },
  DE: {
    cityName: { es: 'Berlín', en: 'Berlin', de: 'Berlin', fr: 'Berlin', it: 'Berlino' },
    station: 'Friedrichstraße',
    streetLabel: 'Unter den Linden',
    landmark: { es: 'Spree', en: 'Spree', de: 'Spree', fr: 'Spree', it: 'Sprea' },
    landmarkKind: 'water',
    directions: {
      es: 'A pocos minutos a pie de la estación de Friedrichstraße.',
      en: 'A few minutes on foot from Friedrichstraße station.',
      de: 'Wenige Gehminuten vom Bahnhof Friedrichstraße.',
      fr: 'À quelques minutes à pied de la gare de Friedrichstraße.',
      it: 'A pochi minuti a piedi dalla stazione di Friedrichstraße.',
    },
    street: 'Unter den Linden 21',
    postalCode: '10117',
    city: 'Berlin',
    title: {
      es: 'En Mitte, en Unter den Linden.',
      en: 'In Mitte, on Unter den Linden.',
      de: 'In Mitte, Unter den Linden.',
      fr: 'À Mitte, sur Unter den Linden.',
      it: 'A Mitte, su Unter den Linden.',
    },
    text: {
      es: 'Estamos a pocos minutos a pie de la estación de Friedrichstraße. Si prefieres hablar en persona, te recibimos aquí.',
      en: 'A few minutes on foot from Friedrichstraße station. If you prefer to talk in person, we welcome you here.',
      de: 'Wenige Gehminuten vom Bahnhof Friedrichstraße. Wenn du lieber persönlich sprichst, empfangen wir dich hier.',
      fr: 'À quelques minutes à pied de la gare de Friedrichstraße. Si vous préférez parler en personne, nous vous recevons ici.',
      it: 'A pochi minuti a piedi dalla stazione di Friedrichstraße. Se preferisci parlare di persona, ti accogliamo qui.',
    },
  },
  FR: {
    cityName: { es: 'París', en: 'Paris', de: 'Paris', fr: 'Paris', it: 'Parigi' },
    station: 'Madeleine',
    streetLabel: 'Rue du Faubourg Saint-Honoré',
    landmark: { es: 'Sena', en: 'Seine', de: 'Seine', fr: 'Seine', it: 'Senna' },
    landmarkKind: 'water',
    directions: {
      es: 'A pocos minutos a pie del metro Madeleine.',
      en: 'A few minutes on foot from Madeleine metro station.',
      de: 'Wenige Gehminuten von der Metrostation Madeleine.',
      fr: 'À quelques minutes à pied du métro Madeleine.',
      it: 'A pochi minuti a piedi dalla metro Madeleine.',
    },
    street: '45 rue du Faubourg Saint-Honoré',
    postalCode: '75008',
    city: 'Paris',
    title: {
      es: 'En el Faubourg Saint-Honoré.',
      en: 'On the Faubourg Saint-Honoré.',
      de: 'Am Faubourg Saint-Honoré.',
      fr: 'Rue du Faubourg Saint-Honoré.',
      it: 'Sul Faubourg Saint-Honoré.',
    },
    text: {
      es: 'Estamos a pocos minutos a pie del metro Madeleine. Si prefieres hablar en persona, te recibimos aquí.',
      en: 'A few minutes on foot from Madeleine metro station. If you prefer to talk in person, we welcome you here.',
      de: 'Wenige Gehminuten von der Metrostation Madeleine. Wenn du lieber persönlich sprichst, empfangen wir dich hier.',
      fr: 'À quelques minutes à pied du métro Madeleine. Si vous préférez parler en personne, nous vous recevons ici.',
      it: 'A pochi minuti a piedi dalla metro Madeleine. Se preferisci parlare di persona, ti accogliamo qui.',
    },
  },
  IT: {
    cityName: { es: 'Roma', en: 'Rome', de: 'Rom', fr: 'Rome', it: 'Roma' },
    station: 'Barberini',
    streetLabel: 'Via Vittorio Veneto',
    landmark: {
      es: 'Villa Borghese',
      en: 'Villa Borghese',
      de: 'Villa Borghese',
      fr: 'Villa Borghèse',
      it: 'Villa Borghese',
    },
    landmarkKind: 'park',
    directions: {
      es: 'A pocos minutos a pie del metro Barberini.',
      en: 'A few minutes on foot from Barberini metro station.',
      de: 'Wenige Gehminuten von der Metrostation Barberini.',
      fr: 'À quelques minutes à pied du métro Barberini.',
      it: 'A pochi minuti a piedi dalla metro Barberini.',
    },
    street: 'Via Vittorio Veneto 45',
    postalCode: '00187',
    city: 'Roma',
    title: {
      es: 'En Via Veneto, junto a Barberini.',
      en: 'On Via Veneto, by Barberini.',
      de: 'An der Via Veneto, bei Barberini.',
      fr: 'Via Veneto, près de Barberini.',
      it: 'In Via Veneto, vicino a Barberini.',
    },
    text: {
      es: 'Estamos a pocos minutos a pie del metro Barberini. Si prefieres hablar en persona, te recibimos aquí.',
      en: 'A few minutes on foot from Barberini metro station. If you prefer to talk in person, we welcome you here.',
      de: 'Wenige Gehminuten von der Metrostation Barberini. Wenn du lieber persönlich sprichst, empfangen wir dich hier.',
      fr: 'À quelques minutes à pied du métro Barberini. Si vous préférez parler en personne, nous vous recevons ici.',
      it: 'A pochi minuti a piedi dalla metro Barberini. Se preferisci parlare di persona, ti accogliamo qui.',
    },
  },
};

/** Replaces the Swiss city in a text with the country's office city ("in Zurich" → "in Madrid"). */
export const withCity = (text: string, country: Country, locale: keyof Text): string =>
  text.replace(OFFICES.CH.cityName[locale], OFFICES[country].cityName[locale]);
