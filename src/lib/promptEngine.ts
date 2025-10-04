/**
 * Prompt Engine for Oops & Ask
 * Generates rich, localized system prompts with detailed worldbuilding
 */

export type PromptType = 'oops' | 'ask' | 'ask_attorney'

interface CulturalReferences {
  etiquetteManual: string
  legalCode: string
  historicalFigure: string
  culturalLocation: string
  dramaticStyle: string
}

// Cultural references by language
const culturalReferences: Record<string, CulturalReferences> = {
  en: {
    etiquetteManual: "The Complete Guide to Victorian Social Graces (1847)",
    legalCode: "The Interpersonal Relations Act of 1892",
    historicalFigure: "Lord Reginald the Apologetic",
    culturalLocation: "the Royal Court of Contrition",
    dramaticStyle: "Shakespearean tragedy"
  },
  es: {
    etiquetteManual: "El Manual Completo de Cortesía Andaluza (1847)",
    legalCode: "El Código de Relaciones Interpersonales de 1892",
    historicalFigure: "Don Reginaldo el Apologético",
    culturalLocation: "la Corte Real de Contrición",
    dramaticStyle: "drama flamenco"
  },
  fr: {
    etiquetteManual: "Le Guide Complet des Grâces Sociales de Versailles (1847)",
    legalCode: "Le Code des Relations Interpersonnelles de 1892",
    historicalFigure: "Monsieur Reginald l'Apologétique",
    culturalLocation: "la Cour Royale de Contrition",
    dramaticStyle: "tragédie classique française"
  },
  de: {
    etiquetteManual: "Der Komplette Leitfaden für Wiener Höflichkeit (1847)",
    legalCode: "Das Gesetz für Zwischenmenschliche Beziehungen von 1892",
    historicalFigure: "Herr Reginald der Entschuldigende",
    culturalLocation: "der Königliche Hof der Reue",
    dramaticStyle: "deutsches Melodram"
  },
  it: {
    etiquetteManual: "La Guida Completa alle Grazie Sociali Veneziane (1847)",
    legalCode: "Il Codice delle Relazioni Interpersonali del 1892",
    historicalFigure: "Signor Reginaldo l'Apologetico",
    culturalLocation: "la Corte Reale del Pentimento",
    dramaticStyle: "melodramma italiano"
  },
  ro: {
    etiquetteManual: "Manualul Complet de Grație Socială Românească (1847)",
    legalCode: "Codul Relațiilor Interpersonale din 1892",
    historicalFigure: "Domnul Reginald Apologeticul",
    culturalLocation: "Curtea Regală a Contriciunii",
    dramaticStyle: "dramă românească"
  },
  pt: {
    etiquetteManual: "O Guia Completo das Graças Sociais Lisboetas (1847)",
    legalCode: "O Código das Relações Interpessoais de 1892",
    historicalFigure: "Senhor Reginaldo o Apologético",
    culturalLocation: "a Corte Real do Arrependimento",
    dramaticStyle: "fado dramático"
  },
  ru: {
    etiquetteManual: "Полное Руководство по Дворянскому Этикету (1847)",
    legalCode: "Кодекс Межличностных Отношений 1892 года",
    historicalFigure: "Господин Реджинальд Извиняющийся",
    culturalLocation: "Королевский Двор Раскаяния",
    dramaticStyle: "русская трагедия"
  },
  ja: {
    etiquetteManual: "江戸時代の完全な社交マナー指南 (1847)",
    legalCode: "人間関係法 1892年",
    historicalFigure: "謝罪のレジナルド卿",
    culturalLocation: "悔恨の宮廷",
    dramaticStyle: "歌舞伎ドラマ"
  },
  ko: {
    etiquetteManual: "조선시대 완전한 사교 예절 가이드 (1847)",
    legalCode: "인간관계법 1892년",
    historicalFigure: "사과의 레지널드 경",
    culturalLocation: "후회의 궁정",
    dramaticStyle: "판소리 드라마"
  },
  zh: {
    etiquetteManual: "清朝完整社交礼仪指南 (1847)",
    legalCode: "人际关系法 1892年",
    historicalFigure: "道歉的雷金纳德勋爵",
    culturalLocation: "悔恨的宫廷",
    dramaticStyle: "京剧悲剧"
  },
  ar: {
    etiquetteManual: "الدليل الكامل للآداب الاجتماعية العثمانية (1847)",
    legalCode: "قانون العلاقات الشخصية 1892",
    historicalFigure: "السيد ريجينالد المعتذر",
    culturalLocation: "بلاط التوبة الملكي",
    dramaticStyle: "الدراما العربية الكلاسيكية"
  },
  nl: {
    etiquetteManual: "De Complete Gids voor Nederlandse Hoofse Manieren (1847)",
    legalCode: "De Wet op Interpersoonlijke Relaties van 1892",
    historicalFigure: "Meneer Reginald de Verontschuldigende",
    culturalLocation: "het Koninklijk Hof van Berouw",
    dramaticStyle: "Nederlandse melodrama"
  },
  sv: {
    etiquetteManual: "Den Kompletta Guiden till Svenska Hövlighet (1847)",
    legalCode: "Lagen om Interpersonella Relationer från 1892",
    historicalFigure: "Herr Reginald den Ursäktande",
    culturalLocation: "det Kungliga Hovet av Ånger",
    dramaticStyle: "svensk melodram"
  },
  no: {
    etiquetteManual: "Den Komplette Guiden til Norsk Høflighet (1847)",
    legalCode: "Loven om Interpersonelle Relasjoner fra 1892",
    historicalFigure: "Herr Reginald den Unnskyldende",
    culturalLocation: "det Kongelige Hoffet av Anger",
    dramaticStyle: "norsk melodram"
  },
  da: {
    etiquetteManual: "Den Komplette Guide til Dansk Høflighed (1847)",
    legalCode: "Loven om Interpersonelle Relationer fra 1892",
    historicalFigure: "Hr. Reginald den Undskyldende",
    culturalLocation: "det Kongelige Hof af Anger",
    dramaticStyle: "dansk melodram"
  },
  fi: {
    etiquetteManual: "Täydellinen Opas Suomen Kohteliaisuuteen (1847)",
    legalCode: "Henkilökohtaisten Suhteiden Laki vuodelta 1892",
    historicalFigure: "Herra Reginald Pahoitteleva",
    culturalLocation: "Katumuksen Kuninkaallinen Hovi",
    dramaticStyle: "suomalainen melodraama"
  },
  pl: {
    etiquetteManual: "Kompletny Przewodnik po Polskiej Grzeczności (1847)",
    legalCode: "Kodeks Relacji Interpersonalnych z 1892",
    historicalFigure: "Pan Reginald Przepraszający",
    culturalLocation: "Królewski Dwór Skruchy",
    dramaticStyle: "polski melodramat"
  },
  tr: {
    etiquetteManual: "Osmanlı Sosyal Nezaketinin Tam Rehberi (1847)",
    legalCode: "Kişilerarası İlişkiler Kanunu 1892",
    historicalFigure: "Bay Reginald Özür Dileyen",
    culturalLocation: "Pişmanlık Kraliyet Sarayı",
    dramaticStyle: "Türk melodramı"
  }
}

// Get cultural references for a language, fallback to English
function getCulturalReferences(language: string): CulturalReferences {
  return culturalReferences[language] || culturalReferences['en']
}

// Get language name for display
function getLanguageName(language: string): string {
  // Let GPT handle any language - just return the language code for prompting
  return language
}

export function getPromptTemplate(type: PromptType, language: string = 'en'): string {
  const culture = getCulturalReferences(language)
  const languageName = getLanguageName(language)
  
  switch (type) {
    case 'oops':
      return getOopsPrompt(culture, languageName, language)
    case 'ask':
      return getAskPrompt(culture, languageName, language)
    case 'ask_attorney':
      return getAttorneyPrompt(culture, languageName, language)
    default:
      return getOopsPrompt(culture, languageName, language)
  }
}

function getOopsPrompt(culture: CulturalReferences, languageName: string, language: string): string {
  return `You are a witty dramatist who crafts over-the-top, emotionally intense MOCK apologies. 
The text must always be COMPLETE (end with punctuation) and under 3 sentences. 
It must be funny, self-aware, and never cut off mid-thought. 
Use dramatic, poetic, or absurd tone but make it sound intentional and polished.

Write 2-3 sentences max that mock the concept of apologizing.
End cleanly, no ellipsis.
Optionally include 1-2 emojis that match the tone.
After the text, add one short fake signature (like "—Baron von Blunder, 1842" or a localized equivalent).

Output only the text, nothing else.`
}

function getAskPrompt(culture: CulturalReferences, languageName: string, language: string): string {
  return `You are a witty dramatist who crafts over-the-top, emotionally intense MOCK requests. 
The text must always be COMPLETE (end with punctuation) and under 3 sentences. 
It must be funny, self-aware, and never cut off mid-thought. 
Use dramatic, poetic, or absurd tone but make it sound intentional and polished.

Write 2-3 sentences max that mock the concept of asking for favors.
End cleanly, no ellipsis.
Optionally include 1-2 emojis that match the tone.
After the text, add one short fake signature (like "—Madame Desirescu, 1842" or a localized equivalent).

Output only the text, nothing else.`
}

function getAttorneyPrompt(culture: CulturalReferences, languageName: string, language: string): string {
  return `You are a witty dramatist who crafts over-the-top, emotionally intense MOCK legal arguments. 
The text must always be COMPLETE (end with punctuation) and under 3 sentences. 
It must be funny, self-aware, and never cut off mid-thought. 
Use dramatic, poetic, or absurd tone but make it sound intentional and polished.

Write 2-3 sentences max that mock the concept of legal arguments.
End cleanly, no ellipsis.
Optionally include 1-2 emojis that match the tone.
After the text, add one short fake signature (like "—Dr. Legalachev, Esq., 1842" or a localized equivalent).

Output only the text, nothing else.`
}
