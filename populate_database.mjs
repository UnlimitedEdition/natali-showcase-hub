import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://flwkfhgnzcjlnrjaagxz.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Sample content data to add to the database
const sampleContent = [
  // Additional home page content
  {
    page_key: 'home',
    section_key: 'featured_recipe',
    language_code: 'en',
    content_text: 'Featured Recipe of the Week',
    is_published: true
  },
  {
    page_key: 'home',
    section_key: 'featured_recipe',
    language_code: 'de',
    content_text: 'Rezept der Woche',
    is_published: true
  },
  {
    page_key: 'home',
    section_key: 'featured_recipe',
    language_code: 'sr',
    content_text: 'Istaknuti Recept Nedelje',
    is_published: true
  },
  {
    page_key: 'home',
    section_key: 'latest_story',
    language_code: 'en',
    content_text: 'Latest Story',
    is_published: true
  },
  {
    page_key: 'home',
    section_key: 'latest_story',
    language_code: 'de',
    content_text: 'Neueste Geschichte',
    is_published: true
  },
  {
    page_key: 'home',
    section_key: 'latest_story',
    language_code: 'sr',
    content_text: 'Najnovija Priča',
    is_published: true
  },
  
  // Additional kitchen page content
  {
    page_key: 'kitchen',
    section_key: 'intro',
    language_code: 'en',
    content_text: 'Welcome to my kitchen where I share my passion for cooking and food.',
    is_published: true
  },
  {
    page_key: 'kitchen',
    section_key: 'intro',
    language_code: 'de',
    content_text: 'Willkommen in meiner Küche, wo ich meine Leidenschaft für Kochen und Essen teile.',
    is_published: true
  },
  {
    page_key: 'kitchen',
    section_key: 'intro',
    language_code: 'sr',
    content_text: 'Dobrodošli u moju kuhinju gde delim svoju strast prema kuvanju i hrani.',
    is_published: true
  },
  {
    page_key: 'kitchen',
    section_key: 'featured_badge',
    language_code: 'en',
    content_text: 'Chef\'s Choice',
    is_published: true
  },
  {
    page_key: 'kitchen',
    section_key: 'featured_badge',
    language_code: 'de',
    content_text: 'Kochs Auswahl',
    is_published: true
  },
  {
    page_key: 'kitchen',
    section_key: 'featured_badge',
    language_code: 'sr',
    content_text: 'Izbor Šefa',
    is_published: true
  },
  
  // Additional stories page content
  {
    page_key: 'stories',
    section_key: 'intro',
    language_code: 'en',
    content_text: 'Discover inspiring stories from people around the world.',
    is_published: true
  },
  {
    page_key: 'stories',
    section_key: 'intro',
    language_code: 'de',
    content_text: 'Entdecken Sie inspirierende Geschichten von Menschen aus aller Welt.',
    is_published: true
  },
  {
    page_key: 'stories',
    section_key: 'intro',
    language_code: 'sr',
    content_text: 'Otkrijte inspirativne priče ljudi sa svih strana sveta.',
    is_published: true
  },
  
  // Additional podcast page content
  {
    page_key: 'podcast',
    section_key: 'intro',
    language_code: 'en',
    content_text: 'Join me on this journey as we explore life, cooking, and storytelling.',
    is_published: true
  },
  {
    page_key: 'podcast',
    section_key: 'intro',
    language_code: 'de',
    content_text: 'Begleiten Sie mich auf dieser Reise, während wir das Leben, das Kochen und das Geschichtenerzählen erforschen.',
    is_published: true
  },
  {
    page_key: 'podcast',
    section_key: 'intro',
    language_code: 'sr',
    content_text: 'Pridružite mi se na ovom putovanju dok istražujemo život, kuvanje i ispričavanje priča.',
    is_published: true
  },
  
  // Additional contact page content
  {
    page_key: 'contact',
    section_key: 'intro',
    language_code: 'en',
    content_text: 'I\'d love to hear from you. Get in touch using the form below.',
    is_published: true
  },
  {
    page_key: 'contact',
    section_key: 'intro',
    language_code: 'de',
    content_text: 'Ich würde gerne von Ihnen hören. Kontaktieren Sie mich über das untenstehende Formular.',
    is_published: true
  },
  {
    page_key: 'contact',
    section_key: 'intro',
    language_code: 'sr',
    content_text: 'Drago mi je da čujem od vas. Stupite u kontakt koristeći formular ispod.',
    is_published: true
  },
  
  // More recipes for kitchen page
  {
    page_key: 'kitchen',
    section_key: 'recipe',
    language_code: 'en',
    content_text: 'Classic Beef Stew',
    content_html: '<p>A hearty and warming beef stew perfect for cold evenings.</p><p><strong>Ingredients:</strong></p><ul><li>2 lbs beef chuck, cut into chunks</li><li>4 potatoes, cubed</li><li>3 carrots, sliced</li><li>1 large onion, diced</li><li>2 cups beef broth</li><li>2 tbsp tomato paste</li><li>2 bay leaves</li><li>Salt and pepper to taste</li></ul>',
    media_url: 'https://example.com/beef-stew.jpg',
    media_type: 'image',
    is_published: true
  },
  {
    page_key: 'kitchen',
    section_key: 'recipe',
    language_code: 'de',
    content_text: 'Klassischer Rindereintopf',
    content_html: '<p>Ein herzhafter und wärmender Rindereintopf, perfekt für kalte Abende.</p><p><strong>Zutaten:</strong></p><ul><li>1 kg Rinderbrust, in Stücke geschnitten</li><li>4 Kartoffeln, gewürfelt</li><li>3 Karotten, in Scheiben geschnitten</li><li>1 große Zwiebel, gewürfelt</li><li>500 ml Rinderbrühe</li><li>2 EL Tomatenmark</li><li>2 Lorbeerblätter</li><li>Salz und Pfeffer nach Geschmack</li></ul>',
    media_url: 'https://example.com/beef-stew.jpg',
    media_type: 'image',
    is_published: true
  },
  {
    page_key: 'kitchen',
    section_key: 'recipe',
    language_code: 'sr',
    content_text: 'Klasično Goveđe Čorba',
    content_html: '<p>Sitna i topla goveđa čorba savršena za hladne večeri.</p><p><strong>Sastojci:</strong></p><ul><li>1 kg govedine, iseckane na komade</li><li>4 krompira, iseckana kockice</li><li>3 šargarepe, iseckane</li><li>1 velika crvena lukovica, iseckana</li><li>500 ml goveđe supne kosti</li><li>2 kašike pasirane paradajz</li><li>2 trava bundeve</li><li>So i biber po ukusu</li></ul>',
    media_url: 'https://example.com/beef-stew.jpg',
    media_type: 'image',
    is_published: true
  },
  
  // More stories
  {
    page_key: 'stories',
    section_key: 'story',
    language_code: 'en',
    content_text: 'My Journey to Becoming a Chef',
    content_html: '<p>Discover how I found my passion for cooking and turned it into a career.</p><p>When I was young, my grandmother taught me how to make her famous apple pie...</p>',
    media_url: 'https://example.com/chef-story.jpg',
    media_type: 'image',
    is_published: true
  },
  {
    page_key: 'stories',
    section_key: 'story',
    language_code: 'de',
    content_text: 'Mein Weg zum Koch',
    content_html: '<p>Entdecken Sie, wie ich meine Leidenschaft für das Kochen entdeckt und in eine Karriere verwandelt habe.</p><p>Als ich jung war, lehrte mich meine Großmutter, wie man ihren berühmten Apfelkuchen macht...</p>',
    media_url: 'https://example.com/chef-story.jpg',
    media_type: 'image',
    is_published: true
  },
  {
    page_key: 'stories',
    section_key: 'story',
    language_code: 'sr',
    content_text: 'Moj Put do Postanja Kuvara',
    content_html: '<p>Otkrijte kako sam pronašla svoju strast prema kuvanju i pretvorila je u karijeru.</p><p>Kada sam bila mala, moja baka me naučila kako da napravim njenu čuvenu jabukovu pitu...</p>',
    media_url: 'https://example.com/chef-story.jpg',
    media_type: 'image',
    is_published: true
  },
  
  // More tips for kitchen page
  {
    page_key: 'kitchen',
    section_key: 'tip',
    language_code: 'en',
    content_text: 'How to Properly Season Your Food',
    content_html: '<p>Learn the art of seasoning and how to enhance the flavors of your dishes.</p><p>Proper seasoning is the foundation of great cooking. Here are some tips...</p>',
    is_published: true
  },
  {
    page_key: 'kitchen',
    section_key: 'tip',
    language_code: 'de',
    content_text: 'Wie man seine Speisen richtig würzt',
    content_html: '<p>Lernen Sie die Kunst der Würzung und wie Sie die Aromen Ihrer Gerichte verbessern können.</p><p>Die richtige Würzung ist die Grundlage guter Kochkunst. Hier sind einige Tipps...</p>',
    is_published: true
  },
  {
    page_key: 'kitchen',
    section_key: 'tip',
    language_code: 'sr',
    content_text: 'Kako Pravilno Začinjavati Hranu',
    content_html: '<p>Naučite umetnost začinjavanja i kako poboljšati ukuse vaših jela.</p><p>Pravilno začinjavanje je osnova odličnog kuvanja. Evo nekoliko saveta...</p>',
    is_published: true
  }
];

// Sample episodes data
const sampleEpisodes = [
  {
    title: 'The Art of Baking',
    description: 'Join me as I explore the science and art behind perfect baking.',
    youtube_url: 'https://www.youtube.com/watch?v=example1',
    thumbnail_url: 'https://img.youtube.com/vi/example1/mqdefault.jpg',
    language_code: 'en',
    is_published: true
  },
  {
    title: 'Backstage Stories',
    description: 'Behind the scenes stories from my latest cooking event.',
    youtube_url: 'https://www.youtube.com/watch?v=example2',
    thumbnail_url: 'https://img.youtube.com/vi/example2/mqdefault.jpg',
    language_code: 'en',
    is_published: true
  },
  {
    title: 'Die Kunst des Backens',
    description: 'Begleiten Sie mich bei der Erforschung der Wissenschaft und Kunst des perfekten Backens.',
    youtube_url: 'https://www.youtube.com/watch?v=example1',
    thumbnail_url: 'https://img.youtube.com/vi/example1/mqdefault.jpg',
    language_code: 'de',
    is_published: true
  },
  {
    title: 'Kulisisanje Iza Scene',
    description: 'Priče iza scene sa mog poslednjeg događaja kuvanja.',
    youtube_url: 'https://www.youtube.com/watch?v=example2',
    thumbnail_url: 'https://img.youtube.com/vi/example2/mqdefault.jpg',
    language_code: 'sr',
    is_published: true
  }
];

async function populateDatabase() {
  console.log('Populating database with additional content...');
  
  try {
    // Insert content data
    console.log(`Inserting ${sampleContent.length} content records...`);
    const { data: contentData, error: contentError } = await supabase
      .from('content')
      .insert(sampleContent);
    
    if (contentError) {
      console.error('Error inserting content:', contentError);
    } else {
      console.log('Content inserted successfully');
    }
    
    // Insert episodes data
    console.log(`Inserting ${sampleEpisodes.length} episode records...`);
    const { data: episodesData, error: episodesError } = await supabase
      .from('episodes')
      .insert(sampleEpisodes);
    
    if (episodesError) {
      console.error('Error inserting episodes:', episodesError);
    } else {
      console.log('Episodes inserted successfully');
    }
    
    console.log('Database population completed!');
  } catch (error) {
    console.error('Error during database population:', error);
  }
}

populateDatabase().then(() => {
  console.log('Script execution completed.');
}).catch(err => {
  console.error('Error executing script:', err);
});