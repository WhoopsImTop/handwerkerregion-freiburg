# Handwerkerregion Freiburg – MVP Feature Specification

## 1. Ziel des Projekts

Aufbau einer regionalen Plattform zur Leadgenerierung für Handwerksbetriebe im Raum Freiburg. Fokus liegt auf:

* Lokaler Sichtbarkeit
* Einfacher Anfragevermittlung
* Vertrauensaufbau durch Bewertungen

---

## 2. Kernkonzept

Die Plattform kombiniert:

* Branchenverzeichnis (ähnlich Gelbe Seiten)
* Lead-Weiterleitung (aktive Vermittlung)
* SEO-getriebene Kategorieseiten

---

## 3. MVP Features

### 3.1 Unternehmensprofile

**Pflichtfelder:**

* Firmenname
* Kategorie (z. B. Elektriker, Dachdecker)
* Adresse (Region Freiburg)
* Telefonnummer
* E-Mail

**Optionale Felder:**

* Beschreibung
* Bilder
* Öffnungszeiten

**Funktionen:**

* Automatisch generierte Profile (Scraper)
* Manuelle Bearbeitung durch Unternehmen (Claim-Funktion)

---

### 3.2 Kategorieseiten (SEO-Fokus)

Für jede Kategorie:

* Beispiel: "Elektriker Freiburg"

**Inhalte:**

* Liste aller Unternehmen
* SEO-Text (Kosten, Tipps, FAQs)
* Call-to-Action (Anfrage stellen)

**Ziel:**

* Ranking bei Google
* Organischer Traffic

---

### 3.3 Standortseiten

Für Orte in der Region:

* Beispiel: "Elektriker Waldkirch"

**Inhalte:**

* Lokale Anbieter
* Regionale Inhalte

---

### 3.4 Anfrageformular (Lead-Generierung)

**Felder:**

* Problembeschreibung
* Kategorie
* Dringlichkeit (z. B. "sofort", "in den nächsten Tagen")
* Kontaktdaten (Name, E-Mail, Telefon)

**Logik:**

* Anfrage wird an 3–5 passende Betriebe gesendet
* Versand per E-Mail

---

### 3.5 Lead-Verteilung

**Optionen:**

* Mehrere Betriebe gleichzeitig kontaktieren
* Priorisierung nach:

  * Reaktionszeit
  * Bewertung
  * Premium-Status

---

### 3.6 Bewertungsfunktion

**Trigger:**

* Nach Anfrageabschluss

**Bewertungskriterien:**

* Reaktionszeit
* Freundlichkeit
* Angebot erhalten

**Ziel:**

* Vertrauensaufbau
* Differenzierung zwischen Betrieben

---

### 3.7 Handwerker-Dashboard (Basic)

**Funktionen:**

* Übersicht eingehender Anfragen
* Kontaktdaten der Kunden
* Status (offen / beantwortet)

---

### 3.8 Badge-System

**Feature:**

* "Teil von Handwerkerregion Freiburg"

**Nutzen:**

* Vertrauen für Kunden
* Backlink für SEO

---

## 4. Monetarisierung

### 4.1 Free Listing

* Kostenloses Basisprofil
* Begrenzte Sichtbarkeit

---

### 4.2 Premium Modelle

#### Basic Premium (~5,99 € / Monat)

* Höhere Platzierung
* Hervorhebung im Listing

#### Pro (~9,99 € / Monat)

* Erweiterbares Profil
* Mehr Sichtbarkeit

#### Premium (~19,99 € / Monat)

* Top-Platzierung
* Priorisierte Lead-Zuteilung
* Zugriff auf alle Features

---

## 5. SEO-Strategie

* Kategorieseiten optimieren
* Standortseiten erstellen
* Content (Ratgeber, Preise, FAQs)
* Interne Verlinkung
* Backlinks durch Badge-System

---

## 6. Technische Architektur

### Frontend

* Nuxt (SSR für SEO)
* Tailwind CSS

### Backend (Optionen)

* Express.js (leichtgewichtig)
* Laravel (umfangreicher)

### Datenbank

* PostgreSQL oder Firebase

---

## 7. Datenmodelle (für Implementierung)

### 7.1 User (Handwerker)

```ts
User {
  id: string
  email: string
  passwordHash: string
  role: 'handwerker' | 'admin'
  createdAt: Date
  updatedAt: Date
}
```

### 7.2 Company (Unternehmen)

```ts
Company {
  id: string
  userId: string | null
  name: string
  slug: string
  categoryId: string
  description?: string
  email: string
  phone: string
  website?: string
  address: string
  city: string
  postalCode: string
  isClaimed: boolean
  isPremium: boolean
  premiumPlan?: 'basic' | 'pro' | 'premium'
  ratingAvg: number
  createdAt: Date
  updatedAt: Date
}
```

### 7.3 Category

```ts
Category {
  id: string
  name: string
  slug: string
  seoTitle: string
  seoDescription: string
  createdAt: Date
}
```

### 7.4 Location (optional für SEO Seiten)

```ts
Location {
  id: string
  name: string
  slug: string
  postalCode?: string
}
```

### 7.5 Lead (Anfrage)

```ts
Lead {
  id: string
  categoryId: string
  description: string
  urgency: 'low' | 'medium' | 'high'
  name: string
  email: string
  phone?: string
  createdAt: Date
}
```

### 7.6 LeadAssignment (Verteilung an Betriebe)

```ts
LeadAssignment {
  id: string
  leadId: string
  companyId: string
  status: 'sent' | 'opened' | 'responded'
  sentAt: Date
}
```

### 7.7 Review (Bewertungen)

```ts
Review {
  id: string
  companyId: string
  leadId?: string
  rating: number
  responseSpeed: number
  friendliness: number
  comment?: string
  createdAt: Date
}
```

### 7.8 Subscription

```ts
Subscription {
  id: string
  companyId: string
  plan: 'basic' | 'pro' | 'premium'
  price: number
  startedAt: Date
  expiresAt?: Date
}
```

---

## 8. API-Struktur (Beispiel)

### Auth

* POST /api/auth/register
* POST /api/auth/login

### Companies

* GET /api/companies
* GET /api/companies/:slug
* POST /api/companies (claim/create)
* PUT /api/companies/:id

### Leads

* POST /api/leads
* GET /api/leads (für Dashboard)

### Reviews

* POST /api/reviews
* GET /api/companies/:id/reviews

### Categories

* GET /api/categories

---

## 9. Logik (Core Flows)

### Lead Flow

1. User erstellt Anfrage
2. System wählt 3–5 passende Companies
3. LeadAssignment wird erstellt
4. E-Mail wird verschickt
5. Handwerker antwortet extern

### Ranking Logik (einfacher Start)

* Premium > Free
* Bewertung (ratingAvg)
* Zufällige Rotation

---

## 10. Entwicklungsphasen

### Phase 1 – MVP (0–3 Monate)

* Profile
* Kategorien
* Anfrageformular
* E-Mail Versand

### Phase 2 – Wachstum (3–6 Monate)

* SEO Content
* Onboarding Handwerker

### Phase 3 – Monetarisierung (6–12 Monate)

* Premium Features
* Ranking-Logik

### Phase 4 – Skalierung (12–24 Monate)

* Weitere Regionen
* Erweiterte Features

---

## 8. Risiken

* Henne-Ei-Problem (Anbieter vs. Nutzer)
* SEO braucht Zeit
* Konkurrenz durch große Plattformen

---

## 9. Erfolgsfaktoren

* Schnelle Umsetzung (MVP)
* Lokaler Fokus
* Einfachheit für Handwerker
* Klare Lead-Qualität

---

## 10. Erweiterungen (Post-MVP)

* In-App Messaging
* Automatisierte Angebote
* Terminbuchung
* Mobile App
* API für Partner

---

## Fazit

Ein schlankes, SEO-getriebenes Lead-Portal mit klarem Fokus auf regionale Handwerker kann als Solo-Projekt funktionieren, wenn der Scope bewusst klein gehalten wird und früh validiert wird.
