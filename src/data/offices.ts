import type { Country } from '../lib/country';
import type { Text } from './fiscal-calendar/types';

/**
 * Oficina por país, en su ciudad más grande (empresa ficticia). Calles reales y céntricas; sin
 * minutos a pie concretos salvo en Zúrich, donde ya los da la web (docs/01).
 */
export interface Office {
  street: string;
  postalCode: string;
  /** Ciudad tal como se escribe en la dirección postal del país. */
  city: string;
  title: Text;
  text: Text;
}

export const OFFICES: Record<Country, Office> = {
  CH: {
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
