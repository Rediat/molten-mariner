// Database of popular timezones/cities for autocomplete suggestions
export const POPULAR_TIMEZONES = [
    { id: 'UTC', city: 'Coordinated Universal Time', country: 'Global', label: 'UTC (GMT)' },
    // North America
    { id: 'America/New_York', city: 'New York', country: 'United States', label: 'New York (EST/EDT)' },
    { id: 'America/Los_Angeles', city: 'Los Angeles', country: 'United States', label: 'Los Angeles (PST/PDT)' },
    { id: 'America/Chicago', city: 'Chicago', country: 'United States', label: 'Chicago (CST/CDT)' },
    { id: 'America/Denver', city: 'Denver', country: 'United States', label: 'Denver (MST/MDT)' },
    { id: 'America/Phoenix', city: 'Phoenix', country: 'United States', label: 'Phoenix (MST - No DST)' },
    { id: 'America/Anchorage', city: 'Anchorage', country: 'United States', label: 'Anchorage (AKST/AKDT)' },
    { id: 'Pacific/Honolulu', city: 'Honolulu', country: 'United States', label: 'Honolulu (HST)' },
    { id: 'America/Toronto', city: 'Toronto', country: 'Canada', label: 'Toronto (EST/EDT)' },
    { id: 'America/Vancouver', city: 'Vancouver', country: 'Canada', label: 'Vancouver (PST/PDT)' },
    { id: 'America/Mexico_City', city: 'Mexico City', country: 'Mexico', label: 'Mexico City (CST)' },
    
    // Europe
    { id: 'Europe/London', city: 'London', country: 'United Kingdom', label: 'London (GMT/BST)' },
    { id: 'Europe/Paris', city: 'Paris', country: 'France', label: 'Paris (CET/CEST)' },
    { id: 'Europe/Berlin', city: 'Berlin', country: 'Germany', label: 'Berlin (CET/CEST)' },
    { id: 'Europe/Rome', city: 'Rome', country: 'Italy', label: 'Rome (CET/CEST)' },
    { id: 'Europe/Madrid', city: 'Madrid', country: 'Spain', label: 'Madrid (CET/CEST)' },
    { id: 'Europe/Athens', city: 'Athens', country: 'Greece', label: 'Athens (EET/EEST)' },
    { id: 'Europe/Moscow', city: 'Moscow', country: 'Russia', label: 'Moscow (MSK)' },
    { id: 'Europe/Istanbul', city: 'Istanbul', country: 'Turkey', label: 'Istanbul (TRT)' },
    { id: 'Europe/Zurich', city: 'Zurich', country: 'Switzerland', label: 'Zurich (CET/CEST)' },
    { id: 'Europe/Dublin', city: 'Dublin', country: 'Ireland', label: 'Dublin (GMT/IST)' },

    // Asia
    { id: 'Asia/Tokyo', city: 'Tokyo', country: 'Japan', label: 'Tokyo (JST)' },
    { id: 'Asia/Seoul', city: 'Seoul', country: 'South Korea', label: 'Seoul (KST)' },
    { id: 'Asia/Singapore', city: 'Singapore', country: 'Singapore', label: 'Singapore (SGT)' },
    { id: 'Asia/Hong_Kong', city: 'Hong Kong', country: 'Hong Kong', label: 'Hong Kong (HKT)' },
    { id: 'Asia/Shanghai', city: 'Shanghai', country: 'China', label: 'Shanghai (CST)' },
    { id: 'Asia/Kolkata', city: 'Mumbai / New Delhi', country: 'India', label: 'Mumbai / New Delhi (IST)' },
    { id: 'Asia/Dubai', city: 'Dubai', country: 'United Arab Emirates', label: 'Dubai (GST)' },
    { id: 'Asia/Riyadh', city: 'Riyadh', country: 'Saudi Arabia', label: 'Riyadh (AST)' },
    { id: 'Asia/Jakarta', city: 'Jakarta', country: 'Indonesia', label: 'Jakarta (WIB)' },
    { id: 'Asia/Bangkok', city: 'Bangkok', country: 'Thailand', label: 'Bangkok (ICT)' },
    { id: 'Asia/Manila', city: 'Manila', country: 'Philippines', label: 'Manila (PHT)' },
    { id: 'Asia/Taipei', city: 'Taipei', country: 'Taiwan', label: 'Taipei (NST)' },
    { id: 'Asia/Tehran', city: 'Tehran', country: 'Iran', label: 'Tehran (IRST/IRDT)' },

    // South America
    { id: 'America/Sao_Paulo', city: 'São Paulo', country: 'Brazil', label: 'São Paulo (BRT/BRST)' },
    { id: 'America/Argentina/Buenos_Aires', city: 'Buenos Aires', country: 'Argentina', label: 'Buenos Aires (ART)' },
    { id: 'America/Bogota', city: 'Bogotá', country: 'Colombia', label: 'Bogotá (COT)' },
    { id: 'America/Santiago', city: 'Santiago', country: 'Chile', label: 'Santiago (CLT/CLST)' },
    
    // Oceania
    { id: 'Australia/Sydney', city: 'Sydney', country: 'Australia', label: 'Sydney (AEST/AEDT)' },
    { id: 'Australia/Melbourne', city: 'Melbourne', country: 'Australia', label: 'Melbourne (AEST/AEDT)' },
    { id: 'Australia/Brisbane', city: 'Brisbane', country: 'Australia', label: 'Brisbane (AEST)' },
    { id: 'Australia/Perth', city: 'Perth', country: 'Australia', label: 'Perth (AWST)' },
    { id: 'Pacific/Auckland', city: 'Auckland', country: 'New Zealand', label: 'Auckland (NZST/NZDT)' },

    // Africa
    { id: 'Africa/Johannesburg', city: 'Johannesburg', country: 'South Africa', label: 'Johannesburg (SAST)' },
    { id: 'Africa/Cairo', city: 'Cairo', country: 'Egypt', label: 'Cairo (EET/EEST)' },
    { id: 'Africa/Nairobi', city: 'Nairobi', country: 'Kenya', label: 'Nairobi (EAT)' },
    { id: 'Africa/Lagos', city: 'Lagos', country: 'Nigeria', label: 'Lagos (WAT)' },
    { id: 'Africa/Casablanca', city: 'Casablanca', country: 'Morocco', label: 'Casablanca (WET/WEST)' }
];

// Wikipedia Time Zone Abbreviations mapping
export const WIKIPEDIA_ABBREVIATIONS = {
    "acdt": { abbr: "ACDT", name: "Australian Central Daylight Saving Time", zones: ["Australia/Adelaide","Australia/Broken_Hill","Australia/Lord_Howe"] },
    "acst": { abbr: "ACST", name: "Australian Central Standard Time", zones: ["Australia/Adelaide","Australia/Broken_Hill","Australia/Darwin"] },
    "act": { abbr: "ACT", name: "Acre Time", zones: ["America/Bogota","America/Cancun","America/Cayman","America/Chicago","America/Coral_Harbour"] },
    "acwst": { abbr: "ACWST", name: "Australian Central Western Standard Time (unofficial)", zones: ["Australia/Eucla"] },
    "adt": { abbr: "ADT", name: "Atlantic Daylight Time", zones: ["America/Glace_Bay","America/Goose_Bay","America/Halifax","America/Moncton","America/Thule","Atlantic/Bermuda"] },
    "aedt": { abbr: "AEDT", name: "Australian Eastern Daylight Saving Time", zones: ["Antarctica/Macquarie","Asia/Magadan","Asia/Sakhalin","Asia/Srednekolymsk","Australia/Hobart"] },
    "aest": { abbr: "AEST", name: "Australian Eastern Standard Time", zones: ["Antarctica/DumontDUrville","Antarctica/Macquarie","Asia/Ust-Nera","Asia/Vladivostok","Australia/Brisbane"] },
    "aet": { abbr: "AET", name: "Australian Eastern Time", zones: ["Antarctica/DumontDUrville","Antarctica/Macquarie","Asia/Ust-Nera","Asia/Vladivostok","Australia/Brisbane"] },
    "aft": { abbr: "AFT", name: "Afghanistan Time", zones: ["Asia/Kabul"] },
    "akdt": { abbr: "AKDT", name: "Alaska Daylight Time", zones: ["America/Anchorage","America/Juneau","America/Metlakatla","America/Nome","America/Sitka","America/Yakutat"] },
    "akst": { abbr: "AKST", name: "Alaska Standard Time", zones: ["America/Anchorage","America/Juneau","America/Metlakatla","America/Nome","America/Sitka","America/Yakutat"] },
    "almt": { abbr: "ALMT", name: "Alma-Ata Time&#91;1&#93;", zones: ["Asia/Bishkek","Asia/Dhaka","Asia/Omsk","Asia/Thimphu","Asia/Urumqi"] },
    "amst": { abbr: "AMST", name: "Amazon Summer Time (Brazil)&#91;2&#93;", zones: ["America/Araguaina","America/Argentina/La_Rioja","America/Argentina/Rio_Gallegos","America/Argentina/Salta","America/Argentina/San_Juan"] },
    "amt": { abbr: "AMT", name: "Amazon Time (Brazil)&#91;3&#93;", zones: ["America/Anguilla","America/Antigua","America/Aruba","America/Barbados","America/Blanc-Sablon"] },
    "anat": { abbr: "ANAT", name: "Anadyr Time&#91;4&#93;", zones: ["Antarctica/McMurdo","Asia/Anadyr","Asia/Kamchatka","Pacific/Auckland","Pacific/Fiji"] },
    "aqtt": { abbr: "AQTT", name: "Aqtobe Time&#91;5&#93;", zones: ["Antarctica/Mawson","Antarctica/Vostok","Asia/Almaty","Asia/Aqtau","Asia/Aqtobe"] },
    "art": { abbr: "ART", name: "Argentina Time", zones: ["America/Araguaina","America/Argentina/La_Rioja","America/Argentina/Rio_Gallegos","America/Argentina/Salta","America/Argentina/San_Juan"] },
    "ast": { abbr: "AST", name: "Arabia Standard Time", zones: ["America/Anguilla","America/Antigua","America/Aruba","America/Barbados","America/Blanc-Sablon","America/Curacao","America/Dominica","America/Glace_Bay","America/Goose_Bay","America/Grenada","America/Guadeloupe","America/Halifax","America/Kralendijk","America/Lower_Princes","America/Marigot","America/Martinique","America/Moncton","America/Montserrat","America/Port_of_Spain","America/Puerto_Rico","America/Santo_Domingo","America/St_Barthelemy","America/St_Kitts","America/St_Lucia","America/St_Thomas","America/St_Vincent","America/Thule","America/Tortola","Atlantic/Bermuda"] },
    "awst": { abbr: "AWST", name: "Australian Western Standard Time", zones: ["Antarctica/Casey","Asia/Brunei","Asia/Hong_Kong","Asia/Irkutsk","Asia/Kuala_Lumpur"] },
    "azot": { abbr: "AZOT", name: "Azores Standard Time", zones: ["America/Godthab","America/Scoresbysund","Atlantic/Azores","Atlantic/Cape_Verde"] },
    "azt": { abbr: "AZT", name: "Azerbaijan Time", zones: ["Asia/Baku","Asia/Dubai","Asia/Muscat","Asia/Tbilisi","Asia/Yerevan"] },
    "bnt": { abbr: "BNT", name: "Brunei Time", zones: ["Antarctica/Casey","Asia/Brunei","Asia/Hong_Kong","Asia/Irkutsk","Asia/Kuala_Lumpur"] },
    "biot": { abbr: "BIOT", name: "British Indian Ocean Time", zones: ["Asia/Bishkek","Asia/Dhaka","Asia/Omsk","Asia/Thimphu","Asia/Urumqi"] },
    "bot": { abbr: "BOT", name: "Bolivia Time", zones: ["America/Anguilla","America/Antigua","America/Aruba","America/Barbados","America/Blanc-Sablon"] },
    "brst": { abbr: "BRST", name: "Brasília Summer Time", zones: ["America/Godthab","America/Miquelon","America/Noronha","America/Scoresbysund","Atlantic/South_Georgia"] },
    "brt": { abbr: "BRT", name: "Brasília Time", zones: ["America/Araguaina","America/Argentina/La_Rioja","America/Argentina/Rio_Gallegos","America/Argentina/Salta","America/Argentina/San_Juan"] },
    "bst": { abbr: "BST", name: "Bangladesh Standard Time", zones: ["Asia/Bishkek","Asia/Dhaka","Asia/Omsk","Asia/Thimphu","Asia/Urumqi"] },
    "btt": { abbr: "BTT", name: "Bhutan Time", zones: ["Asia/Bishkek","Asia/Dhaka","Asia/Omsk","Asia/Thimphu","Asia/Urumqi"] },
    "cat": { abbr: "CAT", name: "Central Africa Time", zones: ["Africa/Blantyre","Africa/Bujumbura","Africa/Cairo","Africa/Ceuta","Africa/Gaborone"] },
    "cct": { abbr: "CCT", name: "Cocos Islands Time", zones: ["Asia/Rangoon","Indian/Cocos"] },
    "cdt": { abbr: "CDT", name: "Central Daylight Time (North America)", zones: ["America/Chicago","America/Indiana/Knox","America/Indiana/Tell_City","America/Matamoros","America/Menominee","America/North_Dakota/Beulah","America/North_Dakota/Center","America/North_Dakota/New_Salem","America/Ojinaga","America/Rankin_Inlet","America/Resolute","America/Winnipeg"] },
    "cest": { abbr: "CEST", name: "Central European Summer Time", zones: ["Europe/Paris","Europe/Berlin","Europe/Rome","Europe/Madrid","Africa/Cairo","Africa/Johannesburg","Africa/Blantyre","Africa/Bujumbura","Africa/Ceuta","Africa/Gaborone","Africa/Harare","Africa/Juba","Africa/Khartoum","Africa/Kigali","Africa/Lubumbashi"] },
    "cet": { abbr: "CET", name: "Central European Time", zones: ["Europe/London","Europe/Paris","Europe/Berlin","Europe/Rome","Europe/Madrid","Africa/Algiers","Africa/Bangui","Africa/Brazzaville","Africa/Casablanca","Africa/Ceuta","Africa/Douala","Africa/El_Aaiun","Africa/Kinshasa","Africa/Lagos","Africa/Libreville"] },
    "chadt": { abbr: "CHADT", name: "Chatham Daylight Time", zones: ["Pacific/Chatham"] },
    "chast": { abbr: "CHAST", name: "Chatham Standard Time", zones: ["Pacific/Chatham"] },
    "chot": { abbr: "CHOT", name: "Choibalsan Standard Time", zones: ["Antarctica/Casey","Asia/Brunei","Asia/Hong_Kong","Asia/Irkutsk","Asia/Kuala_Lumpur"] },
    "chost": { abbr: "CHOST", name: "Choibalsan Summer Time", zones: ["Asia/Chita","Asia/Dili","Asia/Jayapura","Asia/Khandyga","Asia/Pyongyang"] },
    "chst": { abbr: "CHST", name: "Chamorro Standard Time", zones: ["Antarctica/DumontDUrville","Antarctica/Macquarie","Asia/Ust-Nera","Asia/Vladivostok","Australia/Brisbane"] },
    "chut": { abbr: "CHUT", name: "Chuuk Time", zones: ["Antarctica/DumontDUrville","Antarctica/Macquarie","Asia/Ust-Nera","Asia/Vladivostok","Australia/Brisbane"] },
    "cist": { abbr: "CIST", name: "Clipperton Island Standard Time", zones: ["America/Anchorage","America/Juneau","America/Los_Angeles","America/Metlakatla","America/Nome"] },
    "ckt": { abbr: "CKT", name: "Cook Island Time", zones: ["America/Adak","Pacific/Honolulu","Pacific/Rarotonga","Pacific/Tahiti"] },
    "clst": { abbr: "CLST", name: "Chile Summer Time", zones: ["America/Araguaina","America/Argentina/La_Rioja","America/Argentina/Rio_Gallegos","America/Argentina/Salta","America/Argentina/San_Juan"] },
    "clt": { abbr: "CLT", name: "Chile Standard Time", zones: ["America/Anguilla","America/Antigua","America/Aruba","America/Barbados","America/Blanc-Sablon"] },
    "cost": { abbr: "COST", name: "Colombia Summer Time", zones: ["America/Anguilla","America/Antigua","America/Aruba","America/Barbados","America/Blanc-Sablon"] },
    "cot": { abbr: "COT", name: "Colombia Time", zones: ["America/Bogota","America/Cancun","America/Cayman","America/Chicago","America/Coral_Harbour"] },
    "cst": { abbr: "CST", name: "Central Standard Time (Central America)", zones: ["America/Bahia_Banderas","America/Belize","America/Chicago","America/Chihuahua","America/Costa_Rica","America/El_Salvador","America/Guatemala","America/Indiana/Knox","America/Indiana/Tell_City","America/Managua","America/Matamoros","America/Menominee","America/Merida","America/Mexico_City","America/Monterrey","America/North_Dakota/Beulah","America/North_Dakota/Center","America/North_Dakota/New_Salem","America/Ojinaga","America/Rankin_Inlet","America/Regina","America/Resolute","America/Swift_Current","America/Tegucigalpa","America/Winnipeg"] },
    "ct": { abbr: "CT", name: "Central Time", zones: ["America/Bahia_Banderas","America/Belize","America/Boise","America/Cambridge_Bay","America/Chicago"] },
    "cvt": { abbr: "CVT", name: "Cape Verde Time", zones: ["America/Godthab","America/Scoresbysund","Atlantic/Azores","Atlantic/Cape_Verde"] },
    "cwst": { abbr: "CWST", name: "Central Western Standard Time (Australia) unofficial", zones: ["Australia/Eucla"] },
    "cxt": { abbr: "CXT", name: "Christmas Island Time", zones: ["Antarctica/Davis","Asia/Bangkok","Asia/Barnaul","Asia/Hovd","Asia/Jakarta"] },
    "davt": { abbr: "DAVT", name: "Davis Time", zones: ["Antarctica/Davis","Asia/Bangkok","Asia/Barnaul","Asia/Hovd","Asia/Jakarta"] },
    "ddut": { abbr: "DDUT", name: "Dumont d'Urville Time (in French Antarctic station)", zones: ["Antarctica/DumontDUrville","Antarctica/Macquarie","Asia/Ust-Nera","Asia/Vladivostok","Australia/Brisbane"] },
    "dft": { abbr: "DFT", name: "AIX-specific equivalent of Central European Time&#91;NB 1&#93;", zones: ["Africa/Algiers","Africa/Bangui","Africa/Brazzaville","Africa/Casablanca","Africa/Ceuta"] },
    "easst": { abbr: "EASST", name: "Easter Island Summer Time", zones: ["America/Bogota","America/Cancun","America/Cayman","America/Chicago","America/Coral_Harbour"] },
    "east": { abbr: "EAST", name: "Easter Island Standard Time", zones: ["America/Bahia_Banderas","America/Belize","America/Boise","America/Cambridge_Bay","America/Chicago"] },
    "eat": { abbr: "EAT", name: "East Africa Time", zones: ["Africa/Addis_Ababa","Africa/Asmera","Africa/Cairo","Africa/Dar_es_Salaam","Africa/Djibouti"] },
    "ect": { abbr: "ECT", name: "Eastern Caribbean Time (does not recognise DST)", zones: ["America/Anguilla","America/Antigua","America/Aruba","America/Barbados","America/Blanc-Sablon"] },
    "edt": { abbr: "EDT", name: "Eastern Daylight Time (North America)", zones: ["America/Detroit","America/Grand_Turk","America/Indiana/Marengo","America/Indiana/Petersburg","America/Indiana/Vevay","America/Indiana/Vincennes","America/Indiana/Winamac","America/Indianapolis","America/Iqaluit","America/Kentucky/Monticello","America/Louisville","America/Nassau","America/New_York","America/Port-au-Prince","America/Toronto"] },
    "eest": { abbr: "EEST", name: "Eastern European Summer Time", zones: ["Africa/Addis_Ababa","Africa/Asmera","Africa/Cairo","Africa/Dar_es_Salaam","Africa/Djibouti"] },
    "eet": { abbr: "EET", name: "Eastern European Time", zones: ["Africa/Blantyre","Africa/Bujumbura","Africa/Cairo","Africa/Ceuta","Africa/Gaborone"] },
    "egt": { abbr: "EGT", name: "Eastern Greenland Time", zones: ["America/Godthab","America/Scoresbysund","Atlantic/Azores","Atlantic/Cape_Verde"] },
    "est": { abbr: "EST", name: "Eastern Standard Time (North America)", zones: ["America/Cancun","America/Cayman","America/Coral_Harbour","America/Detroit","America/Grand_Turk","America/Indiana/Marengo","America/Indiana/Petersburg","America/Indiana/Vevay","America/Indiana/Vincennes","America/Indiana/Winamac","America/Indianapolis","America/Iqaluit","America/Jamaica","America/Kentucky/Monticello","America/Louisville","America/Nassau","America/New_York","America/Panama","America/Port-au-Prince","America/Toronto"] },
    "et": { abbr: "ET", name: "Eastern Time (North America)", zones: ["America/Bogota","America/Cancun","America/Cayman","America/Chicago","America/Coral_Harbour"] },
    "fet": { abbr: "FET", name: "Further-eastern European Time", zones: ["Africa/Addis_Ababa","Africa/Asmera","Africa/Cairo","Africa/Dar_es_Salaam","Africa/Djibouti"] },
    "fjt": { abbr: "FJT", name: "Fiji Time", zones: ["Antarctica/McMurdo","Asia/Anadyr","Asia/Kamchatka","Pacific/Auckland","Pacific/Fiji"] },
    "fkst": { abbr: "FKST", name: "Falkland Islands Summer Time", zones: ["America/Araguaina","America/Argentina/La_Rioja","America/Argentina/Rio_Gallegos","America/Argentina/Salta","America/Argentina/San_Juan"] },
    "fkt": { abbr: "FKT", name: "Falkland Islands Time", zones: ["America/Anguilla","America/Antigua","America/Aruba","America/Barbados","America/Blanc-Sablon"] },
    "fnt": { abbr: "FNT", name: "Fernando de Noronha Time", zones: ["America/Godthab","America/Miquelon","America/Noronha","America/Scoresbysund","Atlantic/South_Georgia"] },
    "galt": { abbr: "GALT", name: "Galápagos Time", zones: ["America/Bahia_Banderas","America/Belize","America/Boise","America/Cambridge_Bay","America/Chicago"] },
    "gamt": { abbr: "GAMT", name: "Gambier Islands Time", zones: ["America/Adak","America/Anchorage","America/Juneau","America/Metlakatla","America/Nome"] },
    "get": { abbr: "GET", name: "Georgia Standard Time", zones: ["Asia/Baku","Asia/Dubai","Asia/Muscat","Asia/Tbilisi","Asia/Yerevan"] },
    "gft": { abbr: "GFT", name: "French Guiana Time", zones: ["America/Araguaina","America/Argentina/La_Rioja","America/Argentina/Rio_Gallegos","America/Argentina/Salta","America/Argentina/San_Juan"] },
    "gilt": { abbr: "GILT", name: "Gilbert Island Time", zones: ["Antarctica/McMurdo","Asia/Anadyr","Asia/Kamchatka","Pacific/Auckland","Pacific/Fiji"] },
    "git": { abbr: "GIT", name: "Gambier Island Time", zones: ["America/Adak","America/Anchorage","America/Juneau","America/Metlakatla","America/Nome"] },
    "gmt": { abbr: "GMT", name: "Greenwich Mean Time", zones: ["Africa/Abidjan","Africa/Accra","Africa/Bamako","Africa/Banjul","Africa/Bissau","Africa/Conakry","Africa/Dakar","Africa/Freetown","Africa/Lome","Africa/Monrovia","Africa/Nouakchott","Africa/Ouagadougou","Africa/Sao_Tome","America/Danmarkshavn","Antarctica/Troll","Atlantic/Azores","Atlantic/Canary","Atlantic/Faeroe","Atlantic/Madeira","Atlantic/Reykjavik","Atlantic/St_Helena","Europe/Dublin","Europe/Guernsey","Europe/Isle_of_Man","Europe/Jersey","Europe/Lisbon","Europe/London"] },
    "gst": { abbr: "GST", name: "South Georgia and the South Sandwich Islands Time", zones: ["America/Godthab","America/Miquelon","America/Noronha","America/Scoresbysund","Atlantic/South_Georgia"] },
    "gyt": { abbr: "GYT", name: "Guyana Time", zones: ["America/Anguilla","America/Antigua","America/Aruba","America/Barbados","America/Blanc-Sablon"] },
    "hdt": { abbr: "HDT", name: "Hawaii–Aleutian Daylight Time", zones: ["America/Anchorage","America/Adak","America/Juneau","America/Metlakatla","America/Nome","America/Sitka","America/Yakutat","Pacific/Gambier"] },
    "haec": { abbr: "HAEC", name: "Heure Avancée d'Europe Centrale French-language name for CEST", zones: ["Europe/Paris","Europe/Berlin","Europe/Rome","Europe/Madrid","Africa/Cairo","Africa/Johannesburg","Africa/Blantyre","Africa/Bujumbura","Africa/Ceuta","Africa/Gaborone","Africa/Harare","Africa/Juba","Africa/Khartoum","Africa/Kigali","Africa/Lubumbashi"] },
    "hst": { abbr: "HST", name: "Hawaii–Aleutian Standard Time", zones: ["Pacific/Honolulu"] },
    "hkt": { abbr: "HKT", name: "Hong Kong Time", zones: ["Asia/Singapore","Asia/Hong_Kong","Antarctica/Casey","Asia/Brunei","Asia/Irkutsk","Asia/Kuala_Lumpur","Asia/Kuching","Asia/Macau","Asia/Makassar","Asia/Manila","Asia/Shanghai","Asia/Taipei","Asia/Ulaanbaatar","Australia/Perth"] },
    "hmt": { abbr: "HMT", name: "Heard and McDonald Islands Time", zones: ["Antarctica/Mawson","Antarctica/Vostok","Asia/Almaty","Asia/Aqtau","Asia/Aqtobe","Asia/Ashgabat","Asia/Atyrau","Asia/Dushanbe","Asia/Karachi","Asia/Oral","Asia/Qostanay","Asia/Qyzylorda","Asia/Samarkand","Asia/Tashkent","Asia/Yekaterinburg"] },
    "hovst": { abbr: "HOVST", name: "Hovd Summer Time (not used from 2017–present)", zones: ["Asia/Singapore","Asia/Hong_Kong","Antarctica/Casey","Asia/Brunei","Asia/Irkutsk","Asia/Kuala_Lumpur","Asia/Kuching","Asia/Macau","Asia/Makassar","Asia/Manila","Asia/Shanghai","Asia/Taipei","Asia/Ulaanbaatar","Australia/Perth"] },
    "hovt": { abbr: "HOVT", name: "Hovd Time", zones: ["Antarctica/Davis","Asia/Bangkok","Asia/Barnaul","Asia/Hovd","Asia/Jakarta","Asia/Krasnoyarsk","Asia/Novokuznetsk","Asia/Novosibirsk","Asia/Phnom_Penh","Asia/Pontianak","Asia/Saigon","Asia/Tomsk","Asia/Vientiane","Indian/Christmas"] },
    "ict": { abbr: "ICT", name: "Indochina Time", zones: ["Antarctica/Davis","Asia/Bangkok","Asia/Barnaul","Asia/Hovd","Asia/Jakarta","Asia/Krasnoyarsk","Asia/Novokuznetsk","Asia/Novosibirsk","Asia/Phnom_Penh","Asia/Pontianak","Asia/Saigon","Asia/Tomsk","Asia/Vientiane","Indian/Christmas"] },
    "idt": { abbr: "IDT", name: "Israel Daylight Time", zones: ["Europe/Moscow","Africa/Cairo","Africa/Addis_Ababa","Africa/Asmera","Africa/Dar_es_Salaam","Africa/Djibouti","Africa/Kampala","Africa/Mogadishu","Africa/Nairobi","Antarctica/Syowa","Asia/Aden","Asia/Amman","Asia/Baghdad","Asia/Bahrain","Asia/Beirut"] },
    "iot": { abbr: "IOT", name: "Indian Ocean Time", zones: ["Asia/Bishkek","Asia/Dhaka","Asia/Omsk","Asia/Thimphu","Asia/Urumqi","Indian/Chagos"] },
    "irdt": { abbr: "IRDT", name: "Iran Daylight Time", zones: ["Asia/Kabul"] },
    "irkt": { abbr: "IRKT", name: "Irkutsk Time", zones: ["Asia/Singapore","Asia/Hong_Kong","Antarctica/Casey","Asia/Brunei","Asia/Irkutsk","Asia/Kuala_Lumpur","Asia/Kuching","Asia/Macau","Asia/Makassar","Asia/Manila","Asia/Shanghai","Asia/Taipei","Asia/Ulaanbaatar","Australia/Perth"] },
    "irst": { abbr: "IRST", name: "Iran Standard Time", zones: ["Asia/Tehran"] },
    "ist": { abbr: "IST", name: "Indian Standard Time", zones: ["Asia/Calcutta","Asia/Colombo"] },
    "jst": { abbr: "JST", name: "Japan Standard Time", zones: ["Asia/Tokyo","Asia/Seoul","Asia/Chita","Asia/Dili","Asia/Jayapura","Asia/Khandyga","Asia/Pyongyang","Asia/Yakutsk","Pacific/Palau"] },
    "kalt": { abbr: "KALT", name: "Kaliningrad Time", zones: ["Europe/Paris","Europe/Berlin","Europe/Rome","Europe/Madrid","Africa/Cairo","Africa/Johannesburg","Africa/Blantyre","Africa/Bujumbura","Africa/Ceuta","Africa/Gaborone","Africa/Harare","Africa/Juba","Africa/Khartoum","Africa/Kigali","Africa/Lubumbashi"] },
    "kgt": { abbr: "KGT", name: "Kyrgyzstan Time", zones: ["Asia/Bishkek","Asia/Dhaka","Asia/Omsk","Asia/Thimphu","Asia/Urumqi","Indian/Chagos"] },
    "kost": { abbr: "KOST", name: "Kosrae Time", zones: ["Australia/Sydney","Antarctica/Macquarie","Asia/Magadan","Asia/Sakhalin","Asia/Srednekolymsk","Australia/Hobart","Australia/Lord_Howe","Australia/Melbourne","Pacific/Bougainville","Pacific/Efate","Pacific/Guadalcanal","Pacific/Kosrae","Pacific/Norfolk","Pacific/Noumea","Pacific/Ponape"] },
    "krat": { abbr: "KRAT", name: "Krasnoyarsk Time", zones: ["Antarctica/Davis","Asia/Bangkok","Asia/Barnaul","Asia/Hovd","Asia/Jakarta","Asia/Krasnoyarsk","Asia/Novokuznetsk","Asia/Novosibirsk","Asia/Phnom_Penh","Asia/Pontianak","Asia/Saigon","Asia/Tomsk","Asia/Vientiane","Indian/Christmas"] },
    "kst": { abbr: "KST", name: "Korea Standard Time", zones: ["Asia/Tokyo","Asia/Seoul","Asia/Chita","Asia/Dili","Asia/Jayapura","Asia/Khandyga","Asia/Pyongyang","Asia/Yakutsk","Pacific/Palau"] },
    "lhst": { abbr: "LHST", name: "Lord Howe Standard Time", zones: ["Australia/Adelaide","Australia/Broken_Hill","Australia/Lord_Howe"] },
    "lint": { abbr: "LINT", name: "Line Islands Time", zones: ["Pacific/Kiritimati"] },
    "magt": { abbr: "MAGT", name: "Magadan Time", zones: ["Pacific/Auckland","Antarctica/McMurdo","Asia/Anadyr","Asia/Kamchatka","Pacific/Fiji","Pacific/Funafuti","Pacific/Kwajalein","Pacific/Majuro","Pacific/Nauru","Pacific/Norfolk","Pacific/Tarawa","Pacific/Wake","Pacific/Wallis"] },
    "mart": { abbr: "MART", name: "Marquesas Islands Time", zones: ["Pacific/Marquesas"] },
    "mawt": { abbr: "MAWT", name: "Mawson Station Time", zones: ["Antarctica/Mawson","Antarctica/Vostok","Asia/Almaty","Asia/Aqtau","Asia/Aqtobe","Asia/Ashgabat","Asia/Atyrau","Asia/Dushanbe","Asia/Karachi","Asia/Oral","Asia/Qostanay","Asia/Qyzylorda","Asia/Samarkand","Asia/Tashkent","Asia/Yekaterinburg"] },
    "mdt": { abbr: "MDT", name: "Mountain Daylight Time (North America)", zones: ["America/Denver","America/Boise","America/Cambridge_Bay","America/Ciudad_Juarez","America/Edmonton","America/Inuvik"] },
    "met": { abbr: "MET", name: "Middle European Time (same zone as CET)", zones: ["Europe/London","Europe/Paris","Europe/Berlin","Europe/Rome","Europe/Madrid","Africa/Algiers","Africa/Bangui","Africa/Brazzaville","Africa/Casablanca","Africa/Ceuta","Africa/Douala","Africa/El_Aaiun","Africa/Kinshasa","Africa/Lagos","Africa/Libreville"] },
    "mest": { abbr: "MEST", name: "Middle European Summer Time (same zone as CEST)", zones: ["Europe/Paris","Europe/Berlin","Europe/Rome","Europe/Madrid","Africa/Cairo","Africa/Johannesburg","Africa/Blantyre","Africa/Bujumbura","Africa/Ceuta","Africa/Gaborone","Africa/Harare","Africa/Juba","Africa/Khartoum","Africa/Kigali","Africa/Lubumbashi"] },
    "mht": { abbr: "MHT", name: "Marshall Islands Time", zones: ["Pacific/Auckland","Antarctica/McMurdo","Asia/Anadyr","Asia/Kamchatka","Pacific/Fiji","Pacific/Funafuti","Pacific/Kwajalein","Pacific/Majuro","Pacific/Nauru","Pacific/Norfolk","Pacific/Tarawa","Pacific/Wake","Pacific/Wallis"] },
    "mist": { abbr: "MIST", name: "Macquarie Island Station Time", zones: ["Australia/Sydney","Antarctica/Macquarie","Asia/Magadan","Asia/Sakhalin","Asia/Srednekolymsk","Australia/Hobart","Australia/Lord_Howe","Australia/Melbourne","Pacific/Bougainville","Pacific/Efate","Pacific/Guadalcanal","Pacific/Kosrae","Pacific/Norfolk","Pacific/Noumea","Pacific/Ponape"] },
    "mit": { abbr: "MIT", name: "Marquesas Islands Time", zones: ["Pacific/Marquesas"] },
    "mmt": { abbr: "MMT", name: "Myanmar Standard Time", zones: ["Asia/Rangoon","Indian/Cocos"] },
    "msk": { abbr: "MSK", name: "Moscow Time", zones: ["Europe/Moscow","Africa/Cairo","Africa/Addis_Ababa","Africa/Asmera","Africa/Dar_es_Salaam","Africa/Djibouti","Africa/Kampala","Africa/Mogadishu","Africa/Nairobi","Antarctica/Syowa","Asia/Aden","Asia/Amman","Asia/Baghdad","Asia/Bahrain","Asia/Beirut"] },
    "mst": { abbr: "MST", name: "Malaysian Standard Time", zones: ["America/Denver","America/Phoenix","America/Boise","America/Cambridge_Bay","America/Ciudad_Juarez","America/Creston","America/Dawson_Creek","America/Edmonton","America/Fort_Nelson","America/Inuvik"] },
    "mt": { abbr: "MT", name: "Mountain Time (North America)", zones: ["America/Los_Angeles","America/Denver","America/Phoenix","America/Boise","America/Cambridge_Bay","America/Ciudad_Juarez","America/Creston","America/Dawson","America/Dawson_Creek","America/Edmonton","America/Fort_Nelson","America/Hermosillo","America/Inuvik","America/Mazatlan","America/Tijuana"] },
    "mut": { abbr: "MUT", name: "Mauritius Time", zones: ["Asia/Dubai","Asia/Baku","Asia/Muscat","Asia/Tbilisi","Asia/Yerevan","Europe/Astrakhan","Europe/Samara","Europe/Saratov","Europe/Ulyanovsk","Indian/Mahe","Indian/Mauritius","Indian/Reunion"] },
    "mvt": { abbr: "MVT", name: "Maldives Time", zones: ["Antarctica/Mawson","Antarctica/Vostok","Asia/Almaty","Asia/Aqtau","Asia/Aqtobe","Asia/Ashgabat","Asia/Atyrau","Asia/Dushanbe","Asia/Karachi","Asia/Oral","Asia/Qostanay","Asia/Qyzylorda","Asia/Samarkand","Asia/Tashkent","Asia/Yekaterinburg"] },
    "myt": { abbr: "MYT", name: "Malaysia Time", zones: ["Asia/Singapore","Asia/Hong_Kong","Antarctica/Casey","Asia/Brunei","Asia/Irkutsk","Asia/Kuala_Lumpur","Asia/Kuching","Asia/Macau","Asia/Makassar","Asia/Manila","Asia/Shanghai","Asia/Taipei","Asia/Ulaanbaatar","Australia/Perth"] },
    "nct": { abbr: "NCT", name: "New Caledonia Time", zones: ["Australia/Sydney","Antarctica/Macquarie","Asia/Magadan","Asia/Sakhalin","Asia/Srednekolymsk","Australia/Hobart","Australia/Lord_Howe","Australia/Melbourne","Pacific/Bougainville","Pacific/Efate","Pacific/Guadalcanal","Pacific/Kosrae","Pacific/Norfolk","Pacific/Noumea","Pacific/Ponape"] },
    "ndt": { abbr: "NDT", name: "Newfoundland Daylight Time", zones: ["America/St_Johns"] },
    "nft": { abbr: "NFT", name: "Norfolk Island Time", zones: ["Australia/Sydney","Antarctica/Macquarie","Asia/Magadan","Asia/Sakhalin","Asia/Srednekolymsk","Australia/Hobart","Australia/Lord_Howe","Australia/Melbourne","Pacific/Bougainville","Pacific/Efate","Pacific/Guadalcanal","Pacific/Kosrae","Pacific/Norfolk","Pacific/Noumea","Pacific/Ponape"] },
    "novt": { abbr: "NOVT", name: "Novosibirsk Time &#91;9&#93;", zones: ["Antarctica/Davis","Asia/Bangkok","Asia/Barnaul","Asia/Hovd","Asia/Jakarta","Asia/Krasnoyarsk","Asia/Novokuznetsk","Asia/Novosibirsk","Asia/Phnom_Penh","Asia/Pontianak","Asia/Saigon","Asia/Tomsk","Asia/Vientiane","Indian/Christmas"] },
    "npt": { abbr: "NPT", name: "Nepal Time", zones: ["Asia/Katmandu"] },
    "nst": { abbr: "NST", name: "Newfoundland Standard Time", zones: ["America/St_Johns"] },
    "nt": { abbr: "NT", name: "Newfoundland Time", zones: ["America/St_Johns"] },
    "nut": { abbr: "NUT", name: "Niue Time", zones: ["Pacific/Midway","Pacific/Niue","Pacific/Pago_Pago"] },
    "nzdt": { abbr: "NZDT", name: "New Zealand Daylight Time", zones: ["Antarctica/McMurdo","Pacific/Apia","Pacific/Auckland","Pacific/Enderbury","Pacific/Fakaofo"] },
    "nzdst&#91;10&#93;": { abbr: "NZDST&#91;10&#93;", name: "New Zealand Daylight Saving Time", zones: ["Antarctica/McMurdo","Pacific/Apia","Pacific/Auckland","Pacific/Enderbury","Pacific/Fakaofo"] },
    "nzst": { abbr: "NZST", name: "New Zealand Standard Time", zones: ["Antarctica/McMurdo","Asia/Anadyr","Asia/Kamchatka","Pacific/Auckland","Pacific/Fiji"] },
    "omst": { abbr: "OMST", name: "Omsk Time", zones: ["Asia/Bishkek","Asia/Dhaka","Asia/Omsk","Asia/Thimphu","Asia/Urumqi","Indian/Chagos"] },
    "orat": { abbr: "ORAT", name: "Oral Time", zones: ["Antarctica/Mawson","Antarctica/Vostok","Asia/Almaty","Asia/Aqtau","Asia/Aqtobe","Asia/Ashgabat","Asia/Atyrau","Asia/Dushanbe","Asia/Karachi","Asia/Oral","Asia/Qostanay","Asia/Qyzylorda","Asia/Samarkand","Asia/Tashkent","Asia/Yekaterinburg"] },
    "pdt": { abbr: "PDT", name: "Pacific Daylight Time (North America)", zones: ["America/Los_Angeles","America/Tijuana","America/Vancouver"] },
    "pet": { abbr: "PET", name: "Peru Time", zones: ["America/Bogota","America/Cancun","America/Cayman","America/Chicago","America/Coral_Harbour"] },
    "pett": { abbr: "PETT", name: "Kamchatka Time", zones: ["Antarctica/McMurdo","Asia/Anadyr","Asia/Kamchatka","Pacific/Auckland","Pacific/Fiji"] },
    "pgt": { abbr: "PGT", name: "Papua New Guinea Time", zones: ["Antarctica/DumontDUrville","Antarctica/Macquarie","Asia/Ust-Nera","Asia/Vladivostok","Australia/Brisbane"] },
    "phot": { abbr: "PHOT", name: "Phoenix Island Time", zones: ["Antarctica/McMurdo","Pacific/Apia","Pacific/Auckland","Pacific/Enderbury","Pacific/Fakaofo"] },
    "pht": { abbr: "PHT", name: "Philippine Time", zones: ["Antarctica/Casey","Asia/Brunei","Asia/Hong_Kong","Asia/Irkutsk","Asia/Kuala_Lumpur","Asia/Kuching","Asia/Macau","Asia/Makassar","Asia/Manila","Asia/Shanghai","Asia/Taipei","Asia/Ulaanbaatar","Australia/Perth"] },
    "phst": { abbr: "PHST", name: "Philippine Standard Time", zones: ["Antarctica/Casey","Asia/Brunei","Asia/Hong_Kong","Asia/Irkutsk","Asia/Kuala_Lumpur","Asia/Kuching","Asia/Macau","Asia/Makassar","Asia/Manila","Asia/Shanghai","Asia/Taipei","Asia/Ulaanbaatar","Australia/Perth"] },
    "pkt": { abbr: "PKT", name: "Pakistan Standard Time", zones: ["Antarctica/Mawson","Antarctica/Vostok","Asia/Almaty","Asia/Aqtau","Asia/Aqtobe","Asia/Ashgabat","Asia/Atyrau","Asia/Dushanbe","Asia/Karachi","Asia/Oral","Asia/Qostanay","Asia/Qyzylorda","Asia/Samarkand","Asia/Tashkent","Asia/Yekaterinburg"] },
    "pmdt": { abbr: "PMDT", name: "Saint Pierre and Miquelon Daylight Time", zones: ["America/Godthab","America/Miquelon","America/Noronha","America/Scoresbysund","Atlantic/South_Georgia"] },
    "pmst": { abbr: "PMST", name: "Saint Pierre and Miquelon Standard Time", zones: ["America/Araguaina","America/Argentina/La_Rioja","America/Argentina/Rio_Gallegos","America/Argentina/Salta","America/Argentina/San_Juan"] },
    "pont": { abbr: "PONT", name: "Pohnpei Standard Time", zones: ["Antarctica/Macquarie","Asia/Magadan","Asia/Sakhalin","Asia/Srednekolymsk","Australia/Hobart","Australia/Lord_Howe","Australia/Melbourne","Pacific/Bougainville","Pacific/Efate","Pacific/Guadalcanal","Pacific/Kosrae","Pacific/Norfolk","Pacific/Noumea","Pacific/Ponape"] },
    "pst": { abbr: "PST", name: "Pacific Standard Time (North America)", zones: ["America/Los_Angeles","America/Tijuana","America/Vancouver"] },
    "pt": { abbr: "PT", name: "Pacific Time (North America)", zones: ["America/Anchorage","America/Juneau","America/Los_Angeles","America/Metlakatla","America/Nome"] },
    "pwt": { abbr: "PWT", name: "Palau Time&#91;11&#93;", zones: ["Asia/Chita","Asia/Dili","Asia/Jayapura","Asia/Khandyga","Asia/Pyongyang"] },
    "pyst": { abbr: "PYST", name: "Paraguay Summer Time&#91;12&#93;", zones: ["America/Araguaina","America/Argentina/La_Rioja","America/Argentina/Rio_Gallegos","America/Argentina/Salta","America/Argentina/San_Juan"] },
    "pyt": { abbr: "PYT", name: "Paraguay Time&#91;13&#93;", zones: ["America/Anguilla","America/Antigua","America/Aruba","America/Barbados","America/Blanc-Sablon"] },
    "ret": { abbr: "RET", name: "Réunion Time", zones: ["Asia/Dubai","Asia/Baku","Asia/Muscat","Asia/Tbilisi","Asia/Yerevan","Europe/Astrakhan","Europe/Samara","Europe/Saratov","Europe/Ulyanovsk","Indian/Mahe","Indian/Mauritius","Indian/Reunion"] },
    "rott": { abbr: "ROTT", name: "Rothera Research Station Time", zones: ["America/Araguaina","America/Argentina/La_Rioja","America/Argentina/Rio_Gallegos","America/Argentina/Salta","America/Argentina/San_Juan"] },
    "sakt": { abbr: "SAKT", name: "Sakhalin Island Time", zones: ["Antarctica/Macquarie","Asia/Magadan","Asia/Sakhalin","Asia/Srednekolymsk","Australia/Hobart","Australia/Lord_Howe","Australia/Melbourne","Pacific/Bougainville","Pacific/Efate","Pacific/Guadalcanal","Pacific/Kosrae","Pacific/Norfolk","Pacific/Noumea","Pacific/Ponape"] },
    "samt": { abbr: "SAMT", name: "Samara Time", zones: ["Asia/Dubai","Asia/Baku","Asia/Muscat","Asia/Tbilisi","Asia/Yerevan","Europe/Astrakhan","Europe/Samara","Europe/Saratov","Europe/Ulyanovsk","Indian/Mahe","Indian/Mauritius","Indian/Reunion"] },
    "sast": { abbr: "SAST", name: "South African Standard Time", zones: ["Africa/Blantyre","Africa/Bujumbura","Africa/Cairo","Africa/Ceuta","Africa/Gaborone"] },
    "sbt": { abbr: "SBT", name: "Solomon Islands Time", zones: ["Antarctica/Macquarie","Asia/Magadan","Asia/Sakhalin","Asia/Srednekolymsk","Australia/Hobart","Australia/Lord_Howe","Australia/Melbourne","Pacific/Bougainville","Pacific/Efate","Pacific/Guadalcanal","Pacific/Kosrae","Pacific/Norfolk","Pacific/Noumea","Pacific/Ponape"] },
    "sct": { abbr: "SCT", name: "Seychelles Time", zones: ["Asia/Dubai","Asia/Baku","Asia/Muscat","Asia/Tbilisi","Asia/Yerevan","Europe/Astrakhan","Europe/Samara","Europe/Saratov","Europe/Ulyanovsk","Indian/Mahe","Indian/Mauritius","Indian/Reunion"] },
    "sdt": { abbr: "SDT", name: "Samoa Daylight Time", zones: ["America/Adak","Pacific/Honolulu","Pacific/Rarotonga","Pacific/Tahiti"] },
    "sgt": { abbr: "SGT", name: "Singapore Time", zones: ["Asia/Singapore","Asia/Hong_Kong","Antarctica/Casey","Asia/Brunei","Asia/Irkutsk","Asia/Kuala_Lumpur","Asia/Kuching","Asia/Macau","Asia/Makassar","Asia/Manila","Asia/Shanghai","Asia/Taipei","Asia/Ulaanbaatar","Australia/Perth"] },
    "slst": { abbr: "SLST", name: "Sri Lanka Standard Time", zones: ["Asia/Calcutta","Asia/Colombo"] },
    "sret": { abbr: "SRET", name: "Srednekolymsk Time", zones: ["Antarctica/Macquarie","Asia/Magadan","Asia/Sakhalin","Asia/Srednekolymsk","Australia/Hobart","Australia/Lord_Howe","Australia/Melbourne","Pacific/Bougainville","Pacific/Efate","Pacific/Guadalcanal","Pacific/Kosrae","Pacific/Norfolk","Pacific/Noumea","Pacific/Ponape"] },
    "srt": { abbr: "SRT", name: "Suriname Time", zones: ["America/Araguaina","America/Argentina/La_Rioja","America/Argentina/Rio_Gallegos","America/Argentina/Salta","America/Argentina/San_Juan"] },
    "sst": { abbr: "SST", name: "Samoa Standard Time", zones: ["Pacific/Midway","Pacific/Niue","Pacific/Pago_Pago"] },
    "syot": { abbr: "SYOT", name: "Showa Station Time", zones: ["Africa/Addis_Ababa","Africa/Asmera","Africa/Cairo","Africa/Dar_es_Salaam","Africa/Djibouti"] },
    "taht": { abbr: "TAHT", name: "Tahiti Time", zones: ["America/Adak","Pacific/Honolulu","Pacific/Rarotonga","Pacific/Tahiti"] },
    "tha": { abbr: "THA", name: "Thailand Standard Time", zones: ["Antarctica/Davis","Asia/Bangkok","Asia/Barnaul","Asia/Hovd","Asia/Jakarta","Asia/Krasnoyarsk","Asia/Novokuznetsk","Asia/Novosibirsk","Asia/Phnom_Penh","Asia/Pontianak","Asia/Saigon","Asia/Tomsk","Asia/Vientiane","Indian/Christmas"] },
    "tft": { abbr: "TFT", name: "French Southern and Antarctic Time&#91;14&#93;", zones: ["Antarctica/Mawson","Antarctica/Vostok","Asia/Almaty","Asia/Aqtau","Asia/Aqtobe","Asia/Ashgabat","Asia/Atyrau","Asia/Dushanbe","Asia/Karachi","Asia/Oral","Asia/Qostanay","Asia/Qyzylorda","Asia/Samarkand","Asia/Tashkent","Asia/Yekaterinburg"] },
    "tjt": { abbr: "TJT", name: "Tajikistan Time", zones: ["Antarctica/Mawson","Antarctica/Vostok","Asia/Almaty","Asia/Aqtau","Asia/Aqtobe","Asia/Ashgabat","Asia/Atyrau","Asia/Dushanbe","Asia/Karachi","Asia/Oral","Asia/Qostanay","Asia/Qyzylorda","Asia/Samarkand","Asia/Tashkent","Asia/Yekaterinburg"] },
    "tkt": { abbr: "TKT", name: "Tokelau Time", zones: ["Antarctica/McMurdo","Pacific/Apia","Pacific/Auckland","Pacific/Enderbury","Pacific/Fakaofo"] },
    "tlt": { abbr: "TLT", name: "Timor Leste Time", zones: ["Asia/Chita","Asia/Dili","Asia/Jayapura","Asia/Khandyga","Asia/Pyongyang"] },
    "tmt": { abbr: "TMT", name: "Turkmenistan Time", zones: ["Antarctica/Mawson","Antarctica/Vostok","Asia/Almaty","Asia/Aqtau","Asia/Aqtobe","Asia/Ashgabat","Asia/Atyrau","Asia/Dushanbe","Asia/Karachi","Asia/Oral","Asia/Qostanay","Asia/Qyzylorda","Asia/Samarkand","Asia/Tashkent","Asia/Yekaterinburg"] },
    "trt": { abbr: "TRT", name: "Turkey Time", zones: ["Africa/Addis_Ababa","Africa/Asmera","Africa/Cairo","Africa/Dar_es_Salaam","Africa/Djibouti"] },
    "tot": { abbr: "TOT", name: "Tonga Time", zones: ["Antarctica/McMurdo","Pacific/Apia","Pacific/Auckland","Pacific/Enderbury","Pacific/Fakaofo"] },
    "tst": { abbr: "TST", name: "Taiwan Standard Time", zones: ["Asia/Singapore","Asia/Hong_Kong","Antarctica/Casey","Asia/Brunei","Asia/Irkutsk","Asia/Kuala_Lumpur","Asia/Kuching","Asia/Macau","Asia/Makassar","Asia/Manila","Asia/Shanghai","Asia/Taipei","Asia/Ulaanbaatar","Australia/Perth"] },
    "tvt": { abbr: "TVT", name: "Tuvalu Time", zones: ["Antarctica/McMurdo","Asia/Anadyr","Asia/Kamchatka","Pacific/Auckland","Pacific/Fiji"] },
    "ulast": { abbr: "ULAST", name: "Ulaanbaatar Summer Time", zones: ["Asia/Chita","Asia/Dili","Asia/Jayapura","Asia/Khandyga","Asia/Pyongyang"] },
    "ulat": { abbr: "ULAT", name: "Ulaanbaatar Standard Time", zones: ["Asia/Singapore","Asia/Hong_Kong","Antarctica/Casey","Asia/Brunei","Asia/Irkutsk","Asia/Kuala_Lumpur","Asia/Kuching","Asia/Macau","Asia/Makassar","Asia/Manila","Asia/Shanghai","Asia/Taipei","Asia/Ulaanbaatar","Australia/Perth"] },
    "uyst": { abbr: "UYST", name: "Uruguay Summer Time", zones: ["America/Godthab","America/Miquelon","America/Noronha","America/Scoresbysund","Atlantic/South_Georgia"] },
    "uyt": { abbr: "UYT", name: "Uruguay Standard Time", zones: ["America/Araguaina","America/Argentina/La_Rioja","America/Argentina/Rio_Gallegos","America/Argentina/Salta","America/Argentina/San_Juan"] },
    "uzt": { abbr: "UZT", name: "Uzbekistan Time", zones: ["Antarctica/Mawson","Antarctica/Vostok","Asia/Almaty","Asia/Aqtau","Asia/Aqtobe","Asia/Ashgabat","Asia/Atyrau","Asia/Dushanbe","Asia/Karachi","Asia/Oral","Asia/Qostanay","Asia/Qyzylorda","Asia/Samarkand","Asia/Tashkent","Asia/Yekaterinburg"] },
    "vet": { abbr: "VET", name: "Venezuelan Standard Time", zones: ["America/Anguilla","America/Antigua","America/Aruba","America/Barbados","America/Blanc-Sablon"] },
    "vlat": { abbr: "VLAT", name: "Vladivostok Time", zones: ["Antarctica/DumontDUrville","Antarctica/Macquarie","Asia/Ust-Nera","Asia/Vladivostok","Australia/Brisbane"] },
    "volt": { abbr: "VOLT", name: "Volgograd Time", zones: ["Africa/Addis_Ababa","Africa/Asmera","Africa/Cairo","Africa/Dar_es_Salaam","Africa/Djibouti"] },
    "vost": { abbr: "VOST", name: "Vostok Station Time", zones: ["Asia/Bishkek","Asia/Dhaka","Asia/Omsk","Asia/Thimphu","Asia/Urumqi","Indian/Chagos"] },
    "vut": { abbr: "VUT", name: "Vanuatu Time", zones: ["Antarctica/Macquarie","Asia/Magadan","Asia/Sakhalin","Asia/Srednekolymsk","Australia/Hobart","Australia/Lord_Howe","Australia/Melbourne","Pacific/Bougainville","Pacific/Efate","Pacific/Guadalcanal","Pacific/Kosrae","Pacific/Norfolk","Pacific/Noumea","Pacific/Ponape"] },
    "wakt": { abbr: "WAKT", name: "Wake Island Time", zones: ["Antarctica/McMurdo","Asia/Anadyr","Asia/Kamchatka","Pacific/Auckland","Pacific/Fiji"] },
    "wast": { abbr: "WAST", name: "West Africa Summer Time", zones: ["Africa/Blantyre","Africa/Bujumbura","Africa/Cairo","Africa/Ceuta","Africa/Gaborone"] },
    "wat": { abbr: "WAT", name: "West Africa Time", zones: ["Africa/Algiers","Africa/Bangui","Africa/Brazzaville","Africa/Casablanca","Africa/Ceuta"] },
    "west": { abbr: "WEST", name: "Western European Summer Time", zones: ["Africa/Algiers","Africa/Bangui","Africa/Brazzaville","Africa/Casablanca","Africa/Ceuta"] },
    "wib": { abbr: "WIB", name: "Western Indonesian Time", zones: ["Antarctica/Davis","Asia/Bangkok","Asia/Barnaul","Asia/Hovd","Asia/Jakarta","Asia/Krasnoyarsk","Asia/Novokuznetsk","Asia/Novosibirsk","Asia/Phnom_Penh","Asia/Pontianak","Asia/Saigon","Asia/Tomsk","Asia/Vientiane","Indian/Christmas"] },
    "wit": { abbr: "WIT", name: "Eastern Indonesian Time", zones: ["Asia/Chita","Asia/Dili","Asia/Jayapura","Asia/Khandyga","Asia/Pyongyang"] },
    "wita": { abbr: "WITA", name: "Central Indonesia Time", zones: ["Asia/Singapore","Asia/Hong_Kong","Antarctica/Casey","Asia/Brunei","Asia/Irkutsk","Asia/Kuala_Lumpur","Asia/Kuching","Asia/Macau","Asia/Makassar","Asia/Manila","Asia/Shanghai","Asia/Taipei","Asia/Ulaanbaatar","Australia/Perth"] },
    "wgst": { abbr: "WGST", name: "West Greenland Summer Time&#91;15&#93;", zones: ["America/Godthab","America/Miquelon","America/Noronha","America/Scoresbysund","Atlantic/South_Georgia"] },
    "wgt": { abbr: "WGT", name: "West Greenland Time&#91;16&#93;", zones: ["America/Araguaina","America/Argentina/La_Rioja","America/Argentina/Rio_Gallegos","America/Argentina/Salta","America/Argentina/San_Juan"] },
    "wst": { abbr: "WST", name: "Western Standard Time", zones: ["Antarctica/Casey","Asia/Brunei","Asia/Hong_Kong","Asia/Irkutsk","Asia/Kuala_Lumpur"] },
    "yakt": { abbr: "YAKT", name: "Yakutsk Time", zones: ["Asia/Chita","Asia/Dili","Asia/Jayapura","Asia/Khandyga","Asia/Pyongyang"] },
    "yekt": { abbr: "YEKT", name: "Yekaterinburg Time", zones: ["Antarctica/Mawson","Antarctica/Vostok","Asia/Almaty","Asia/Aqtau","Asia/Aqtobe","Asia/Ashgabat","Asia/Atyrau","Asia/Dushanbe","Asia/Karachi","Asia/Oral","Asia/Qostanay","Asia/Qyzylorda","Asia/Samarkand","Asia/Tashkent","Asia/Yekaterinburg"] }
};

// Dynamically fetch all other supported IANA timezone names to build a comprehensive list
let ALL_TIMEZONES = [];
try {
    if (typeof Intl !== 'undefined' && typeof Intl.supportedValuesOf === 'function') {
        const supported = Intl.supportedValuesOf('timeZone');
        // Map native list
        ALL_TIMEZONES = supported.map(tz => {
            const parts = tz.split('/');
            const city = parts[parts.length - 1]?.replace(/_/g, ' ') || tz;
            const region = parts[0] || '';
            
            let abbrev = '';
            try {
                const tzParts = new Intl.DateTimeFormat('en-US', {
                    timeZone: tz,
                    timeZoneName: 'short'
                }).formatToParts(new Date());
                abbrev = tzParts.find(p => p.type === 'timeZoneName')?.value || '';
            } catch (e) {}

            const labelSuffix = abbrev ? ` (${abbrev})` : '';
            return {
                id: tz,
                city,
                country: region,
                abbrev: abbrev.toLowerCase(),
                label: `${city} (${region})${labelSuffix}`
            };
        });
    }
} catch (e) {
    console.error('Failed to query supported timezones:', e);
}

export const ADDITIONAL_CITIES = [
    // US & Canada
    { city: 'New York', country: 'United States', timezone: 'America/New_York' },
    { city: 'Los Angeles', country: 'United States', timezone: 'America/Los_Angeles' },
    { city: 'Chicago', country: 'United States', timezone: 'America/Chicago' },
    { city: 'Houston', country: 'United States', timezone: 'America/Chicago' },
    { city: 'Phoenix', country: 'United States', timezone: 'America/Phoenix' },
    { city: 'Philadelphia', country: 'United States', timezone: 'America/New_York' },
    { city: 'San Antonio', country: 'United States', timezone: 'America/Chicago' },
    { city: 'San Diego', country: 'United States', timezone: 'America/Los_Angeles' },
    { city: 'Dallas', country: 'United States', timezone: 'America/Chicago' },
    { city: 'Dallas-Fort Worth', country: 'United States', timezone: 'America/Chicago' },
    { city: 'San Jose', country: 'United States', timezone: 'America/Los_Angeles' },
    { city: 'Austin', country: 'United States', timezone: 'America/Chicago' },
    { city: 'Jacksonville', country: 'United States', timezone: 'America/New_York' },
    { city: 'San Francisco', country: 'United States', timezone: 'America/Los_Angeles' },
    { city: 'Columbus', country: 'United States', timezone: 'America/New_York' },
    { city: 'Fort Worth', country: 'United States', timezone: 'America/Chicago' },
    { city: 'Indianapolis', country: 'United States', timezone: 'America/Indiana/Indianapolis' },
    { city: 'Charlotte', country: 'United States', timezone: 'America/New_York' },
    { city: 'Seattle', country: 'United States', timezone: 'America/Los_Angeles' },
    { city: 'Denver', country: 'United States', timezone: 'America/Denver' },
    { city: 'El Paso', country: 'United States', timezone: 'America/Denver' },
    { city: 'Washington D.C.', country: 'United States', timezone: 'America/New_York' },
    { city: 'Boston', country: 'United States', timezone: 'America/New_York' },
    { city: 'Detroit', country: 'United States', timezone: 'America/Detroit' },
    { city: 'Nashville', country: 'United States', timezone: 'America/Chicago' },
    { city: 'Portland', country: 'United States', timezone: 'America/Los_Angeles' },
    { city: 'Memphis', country: 'United States', timezone: 'America/Chicago' },
    { city: 'Oklahoma City', country: 'United States', timezone: 'America/Chicago' },
    { city: 'Las Vegas', country: 'United States', timezone: 'America/Los_Angeles' },
    { city: 'Louisville', country: 'United States', timezone: 'America/Kentucky/Louisville' },
    { city: 'Baltimore', country: 'United States', timezone: 'America/New_York' },
    { city: 'Milwaukee', country: 'United States', timezone: 'America/Chicago' },
    { city: 'Albuquerque', country: 'United States', timezone: 'America/Denver' },
    { city: 'Tucson', country: 'United States', timezone: 'America/Phoenix' },
    { city: 'Fresno', country: 'United States', timezone: 'America/Los_Angeles' },
    { city: 'Sacramento', country: 'United States', timezone: 'America/Los_Angeles' },
    { city: 'Kansas City', country: 'United States', timezone: 'America/Chicago' },
    { city: 'Atlanta', country: 'United States', timezone: 'America/New_York' },
    { city: 'Omaha', country: 'United States', timezone: 'America/Chicago' },
    { city: 'Colorado Springs', country: 'United States', timezone: 'America/Denver' },
    { city: 'Raleigh', country: 'United States', timezone: 'America/New_York' },
    { city: 'Miami', country: 'United States', timezone: 'America/New_York' },
    { city: 'Minneapolis', country: 'United States', timezone: 'America/Chicago' },
    { city: 'Cleveland', country: 'United States', timezone: 'America/New_York' },
    { city: 'New Orleans', country: 'United States', timezone: 'America/Chicago' },
    { city: 'Honolulu', country: 'United States', timezone: 'Pacific/Honolulu' },
    { city: 'Tampa', country: 'United States', timezone: 'America/New_York' },
    { city: 'Pittsburgh', country: 'United States', timezone: 'America/New_York' },
    { city: 'Cincinnati', country: 'United States', timezone: 'America/New_York' },
    { city: 'St. Louis', country: 'United States', timezone: 'America/Chicago' },
    { city: 'Orlando', country: 'United States', timezone: 'America/New_York' },
    { city: 'Salt Lake City', country: 'United States', timezone: 'America/Denver' },
    { city: 'Toronto', country: 'Canada', timezone: 'America/Toronto' },
    { city: 'Montreal', country: 'Canada', timezone: 'America/Toronto' },
    { city: 'Vancouver', country: 'Canada', timezone: 'America/Vancouver' },
    { city: 'Calgary', country: 'Canada', timezone: 'America/Edmonton' },
    { city: 'Edmonton', country: 'Canada', timezone: 'America/Edmonton' },
    { city: 'Ottawa', country: 'Canada', timezone: 'America/Toronto' },
    { city: 'Winnipeg', country: 'Canada', timezone: 'America/Winnipeg' },
    { city: 'Quebec City', country: 'Canada', timezone: 'America/Toronto' },
    { city: 'Halifax', country: 'Canada', timezone: 'America/Halifax' },
    { city: 'Victoria', country: 'Canada', timezone: 'America/Vancouver' },

    // Europe
    { city: 'London', country: 'United Kingdom', timezone: 'Europe/London' },
    { city: 'Birmingham', country: 'United Kingdom', timezone: 'Europe/London' },
    { city: 'Manchester', country: 'United Kingdom', timezone: 'Europe/London' },
    { city: 'Glasgow', country: 'United Kingdom', timezone: 'Europe/London' },
    { city: 'Edinburgh', country: 'United Kingdom', timezone: 'Europe/London' },
    { city: 'Belfast', country: 'United Kingdom', timezone: 'Europe/London' },
    { city: 'Dublin', country: 'Ireland', timezone: 'Europe/Dublin' },
    { city: 'Paris', country: 'France', timezone: 'Europe/Paris' },
    { city: 'Marseille', country: 'France', timezone: 'Europe/Paris' },
    { city: 'Lyon', country: 'France', timezone: 'Europe/Paris' },
    { city: 'Toulouse', country: 'France', timezone: 'Europe/Paris' },
    { city: 'Nice', country: 'France', timezone: 'Europe/Paris' },
    { city: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin' },
    { city: 'Hamburg', country: 'Germany', timezone: 'Europe/Berlin' },
    { city: 'Munich', country: 'Germany', timezone: 'Europe/Berlin' },
    { city: 'Cologne', country: 'Germany', timezone: 'Europe/Berlin' },
    { city: 'Frankfurt', country: 'Germany', timezone: 'Europe/Berlin' },
    { city: 'Stuttgart', country: 'Germany', timezone: 'Europe/Berlin' },
    { city: 'Dusseldorf', country: 'Germany', timezone: 'Europe/Berlin' },
    { city: 'Rome', country: 'Italy', timezone: 'Europe/Rome' },
    { city: 'Milan', country: 'Italy', timezone: 'Europe/Rome' },
    { city: 'Naples', country: 'Italy', timezone: 'Europe/Rome' },
    { city: 'Turin', country: 'Italy', timezone: 'Europe/Rome' },
    { city: 'Venice', country: 'Italy', timezone: 'Europe/Rome' },
    { city: 'Florence', country: 'Italy', timezone: 'Europe/Rome' },
    { city: 'Madrid', country: 'Spain', timezone: 'Europe/Madrid' },
    { city: 'Barcelona', country: 'Spain', timezone: 'Europe/Madrid' },
    { city: 'Valencia', country: 'Spain', timezone: 'Europe/Madrid' },
    { city: 'Seville', country: 'Spain', timezone: 'Europe/Madrid' },
    { city: 'Stockholm', country: 'Sweden', timezone: 'Europe/Stockholm' },
    { city: 'Gothenburg', country: 'Sweden', timezone: 'Europe/Stockholm' },
    { city: 'Oslo', country: 'Norway', timezone: 'Europe/Oslo' },
    { city: 'Copenhagen', country: 'Denmark', timezone: 'Europe/Copenhagen' },
    { city: 'Helsinki', country: 'Finland', timezone: 'Europe/Helsinki' },
    { city: 'Geneva', country: 'Switzerland', timezone: 'Europe/Zurich' },
    { city: 'Zurich', country: 'Switzerland', timezone: 'Europe/Zurich' },
    { city: 'Vienna', country: 'Austria', timezone: 'Europe/Vienna' },
    { city: 'Brussels', country: 'Belgium', timezone: 'Europe/Brussels' },
    { city: 'Amsterdam', country: 'Netherlands', timezone: 'Europe/Amsterdam' },
    { city: 'Rotterdam', country: 'Netherlands', timezone: 'Europe/Amsterdam' },
    { city: 'Athens', country: 'Greece', timezone: 'Europe/Athens' },
    { city: 'Lisbon', country: 'Portugal', timezone: 'Europe/Lisbon' },
    { city: 'Warsaw', country: 'Poland', timezone: 'Europe/Warsaw' },
    { city: 'Krakow', country: 'Poland', timezone: 'Europe/Warsaw' },
    { city: 'Prague', country: 'Czech Republic', timezone: 'Europe/Prague' },
    { city: 'Budapest', country: 'Hungary', timezone: 'Europe/Budapest' },
    { city: 'Bucharest', country: 'Romania', timezone: 'Europe/Bucharest' },
    { city: 'Moscow', country: 'Russia', timezone: 'Europe/Moscow' },
    { city: 'Saint Petersburg', country: 'Russia', timezone: 'Europe/Moscow' },
    { city: 'Istanbul', country: 'Turkey', timezone: 'Europe/Istanbul' },
    { city: 'Ankara', country: 'Turkey', timezone: 'Europe/Istanbul' },

    // Asia & Middle East
    { city: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo' },
    { city: 'Osaka', country: 'Japan', timezone: 'Asia/Tokyo' },
    { city: 'Kyoto', country: 'Japan', timezone: 'Asia/Tokyo' },
    { city: 'Yokohama', country: 'Japan', timezone: 'Asia/Tokyo' },
    { city: 'Seoul', country: 'South Korea', timezone: 'Asia/Seoul' },
    { city: 'Incheon', country: 'South Korea', timezone: 'Asia/Seoul' },
    { city: 'Busan', country: 'South Korea', timezone: 'Asia/Seoul' },
    { city: 'Beijing', country: 'China', timezone: 'Asia/Shanghai' },
    { city: 'Shanghai', country: 'China', timezone: 'Asia/Shanghai' },
    { city: 'Shenzhen', country: 'China', timezone: 'Asia/Shanghai' },
    { city: 'Guangzhou', country: 'China', timezone: 'Asia/Shanghai' },
    { city: 'Chengdu', country: 'China', timezone: 'Asia/Shanghai' },
    { city: 'Hong Kong', country: 'Hong Kong', timezone: 'Asia/Hong_Kong' },
    { city: 'Taipei', country: 'Taiwan', timezone: 'Asia/Taipei' },
    { city: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore' },
    { city: 'Bangkok', country: 'Thailand', timezone: 'Asia/Bangkok' },
    { city: 'Jakarta', country: 'Indonesia', timezone: 'Asia/Jakarta' },
    { city: 'Manila', country: 'Philippines', timezone: 'Asia/Manila' },
    { city: 'Kuala Lumpur', country: 'Malaysia', timezone: 'Asia/Kuala_Lumpur' },
    { city: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata' },
    { city: 'Delhi', country: 'India', timezone: 'Asia/Kolkata' },
    { city: 'New Delhi', country: 'India', timezone: 'Asia/Kolkata' },
    { city: 'Bangalore', country: 'India', timezone: 'Asia/Kolkata' },
    { city: 'Chennai', country: 'India', timezone: 'Asia/Kolkata' },
    { city: 'Hyderabad', country: 'India', timezone: 'Asia/Kolkata' },
    { city: 'Pune', country: 'India', timezone: 'Asia/Kolkata' },
    { city: 'Dubai', country: 'United Arab Emirates', timezone: 'Asia/Dubai' },
    { city: 'Abu Dhabi', country: 'United Arab Emirates', timezone: 'Asia/Dubai' },
    { city: 'Riyadh', country: 'Saudi Arabia', timezone: 'Asia/Riyadh' },
    { city: 'Jeddah', country: 'Saudi Arabia', timezone: 'Asia/Riyadh' },
    { city: 'Tehran', country: 'Iran', timezone: 'Asia/Tehran' },

    // Latin America
    { city: 'Sao Paulo', country: 'Brazil', timezone: 'America/Sao_Paulo' },
    { city: 'Rio de Janeiro', country: 'Brazil', timezone: 'America/Sao_Paulo' },
    { city: 'Brasilia', country: 'Brazil', timezone: 'America/Sao_Paulo' },
    { city: 'Mexico City', country: 'Mexico', timezone: 'America/Mexico_City' },
    { city: 'Guadalajara', country: 'Mexico', timezone: 'America/Mexico_City' },
    { city: 'Monterrey', country: 'Mexico', timezone: 'America/Monterrey' },
    { city: 'Cancun', country: 'Mexico', timezone: 'America/Cancun' },
    { city: 'Buenos Aires', country: 'Argentina', timezone: 'America/Argentina/Buenos_Aires' },
    { city: 'Bogota', country: 'Colombia', timezone: 'America/Bogota' },
    { city: 'Santiago', country: 'Chile', timezone: 'America/Santiago' },
    { city: 'Lima', country: 'Peru', timezone: 'America/Lima' },

    // Oceania
    { city: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney' },
    { city: 'Melbourne', country: 'Australia', timezone: 'Australia/Melbourne' },
    { city: 'Brisbane', country: 'Australia', timezone: 'Australia/Brisbane' },
    { city: 'Perth', country: 'Australia', timezone: 'Australia/Perth' },
    { city: 'Adelaide', country: 'Australia', timezone: 'Australia/Adelaide' },
    { city: 'Canberra', country: 'Australia', timezone: 'Australia/Sydney' },
    { city: 'Auckland', country: 'New Zealand', timezone: 'Pacific/Auckland' },
    { city: 'Wellington', country: 'New Zealand', timezone: 'Pacific/Auckland' },

    // Africa
    { city: 'Cairo', country: 'Egypt', timezone: 'Africa/Cairo' },
    { city: 'Johannesburg', country: 'South Africa', timezone: 'Africa/Johannesburg' },
    { city: 'Cape Town', country: 'South Africa', timezone: 'Africa/Johannesburg' },
    { city: 'Lagos', country: 'Nigeria', timezone: 'Africa/Lagos' },
    { city: 'Nairobi', country: 'Kenya', timezone: 'Africa/Nairobi' },
    { city: 'Casablanca', country: 'Morocco', timezone: 'Africa/Casablanca' }
];

// Fallback search database combining popular list, browser list, additional cities, and Wikipedia abbreviations
export const searchTimezones = (query) => {
    if (!query) return POPULAR_TIMEZONES;
    const normalizedQuery = query.toLowerCase().trim();

    // 1. Search for abbreviation matches (both exact and prefix/partial) from the Wikipedia Abbreviations list
    let abbreviationMatches = [];
    for (const key in WIKIPEDIA_ABBREVIATIONS) {
        // Only trigger abbreviation lookup if the query is a match for the abbreviation key
        if (key === normalizedQuery || (normalizedQuery.length >= 3 && key.startsWith(normalizedQuery))) {
            const abbrevInfo = WIKIPEDIA_ABBREVIATIONS[key];
            abbrevInfo.zones.forEach(zoneId => {
                let zoneObj = POPULAR_TIMEZONES.find(t => t.id === zoneId) || 
                              ALL_TIMEZONES.find(t => t.id === zoneId);
                
                if (!zoneObj) {
                    const parts = zoneId.split('/');
                    const city = parts[parts.length - 1]?.replace(/_/g, ' ') || zoneId;
                    const region = parts[0] || '';
                    zoneObj = {
                        id: zoneId,
                        city,
                        country: region,
                        abbrev: abbrevInfo.abbr.toLowerCase(),
                        label: `${city} (${region}) (${abbrevInfo.abbr})`
                    };
                }
                abbreviationMatches.push(zoneObj);
            });
        }
    }

    // 2. Search in additional cities mapping list
    const cityMatches = ADDITIONAL_CITIES.filter(c => 
        c.city.toLowerCase().includes(normalizedQuery) ||
        c.country.toLowerCase().includes(normalizedQuery)
    ).map(c => {
        let abbrev = '';
        try {
            const tzParts = new Intl.DateTimeFormat('en-US', {
                timeZone: c.timezone,
                timeZoneName: 'short'
            }).formatToParts(new Date());
            abbrev = tzParts.find(p => p.type === 'timeZoneName')?.value || '';
        } catch (e) {}

        const labelSuffix = abbrev ? ` (${abbrev})` : '';
        return {
            id: c.timezone,
            city: c.city,
            country: c.country,
            abbrev: abbrev.toLowerCase(),
            label: `${c.city} (${c.country})${labelSuffix}`,
            isCityAlias: true,
            customLabel: c.city
        };
    });

    // 3. Search in popular list
    const popularMatches = POPULAR_TIMEZONES.filter(tz => 
        tz.city.toLowerCase().includes(normalizedQuery) ||
        tz.country.toLowerCase().includes(normalizedQuery) ||
        tz.label.toLowerCase().includes(normalizedQuery) ||
        tz.id.toLowerCase().includes(normalizedQuery)
    );

    // 4. Search in all timezones
    const popularIds = new Set(POPULAR_TIMEZONES.map(t => t.id));
    const abbrevIds = new Set(abbreviationMatches.map(t => t.id));
    const cityIds = new Set(cityMatches.map(t => t.id));
    
    const otherMatches = ALL_TIMEZONES.filter(tz => 
        !popularIds.has(tz.id) &&
        !abbrevIds.has(tz.id) &&
        !cityIds.has(tz.id) && (
            tz.city.toLowerCase().includes(normalizedQuery) ||
            tz.country.toLowerCase().includes(normalizedQuery) ||
            tz.label.toLowerCase().includes(normalizedQuery) ||
            tz.id.toLowerCase().includes(normalizedQuery) ||
            (tz.abbrev && tz.abbrev === normalizedQuery) ||
            (tz.abbrev && tz.abbrev.includes(normalizedQuery))
        )
    );

    // Combine results
    const combined = [...abbreviationMatches, ...cityMatches, ...popularMatches, ...otherMatches];
    // Deduplicate (keep unique id + customLabel pairings so aliases aren't filtered out)
    const seen = new Set();
    const result = [];
    for (const item of combined) {
        const key = item.customLabel ? `${item.id}_${item.customLabel}` : item.id;
        if (!seen.has(key)) {
            seen.add(key);
            result.push(item);
        }
    }

    // Filter to guarantee every returned result strictly matches what's visible in the list items
    const strictlyMatching = result.filter(item => {
        const labelText = (item.label || item.city || '').toLowerCase();
        const idText = (item.id || '').toLowerCase();
        const abbrevText = (item.abbrev || '').toLowerCase();
        
        let offsetText = '';
        let currentAbbrevText = '';
        if (item.id) {
            try {
                const now = new Date();
                offsetText = getTimeZoneOffset(now, item.id).toLowerCase();
                currentAbbrevText = getTimeZoneAbbrev(now, item.id).toLowerCase();
            } catch (e) {}
        }
        
        return labelText.includes(normalizedQuery) ||
               idText.includes(normalizedQuery) ||
               abbrevText.includes(normalizedQuery) ||
               currentAbbrevText.includes(normalizedQuery) ||
               offsetText.includes(normalizedQuery);
    });

    // Score results for relevance sorting
    const scoredResults = strictlyMatching.map(item => {
        const cityLower = (item.city || '').toLowerCase();
        const countryLower = (item.country || '').toLowerCase();
        const labelLower = (item.label || '').toLowerCase();
        const idLower = (item.id || '').toLowerCase();
        const abbrevLower = (item.abbrev || '').toLowerCase();
        
        let score = 0;
        
        if (cityLower === normalizedQuery) {
            score += 100;
        } else if (cityLower.startsWith(normalizedQuery)) {
            score += 80;
        } else if (cityLower.includes(normalizedQuery)) {
            score += 60;
        } else if (idLower.includes(normalizedQuery) || labelLower.includes(normalizedQuery)) {
            score += 40;
        } else if (countryLower.includes(normalizedQuery)) {
            score += 20;
        } else if (abbrevLower.includes(normalizedQuery)) {
            score += 10;
        }
        
        return { item, score };
    });

    // Sort by score descending, then by city name alphabetically
    scoredResults.sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score;
        }
        return (a.item.city || '').localeCompare(b.item.city || '');
    });

    return scoredResults.map(x => x.item).slice(0, 50);
};

export const getTimeZoneAbbrev = (date, timeZone) => {
    try {
        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone,
            timeZoneName: 'short'
        }).formatToParts(date);
        return parts.find(p => p.type === 'timeZoneName')?.value || '';
    } catch (e) {
        return '';
    }
};

// Get full timezone offset label (e.g., GMT-5, GMT+9:30)
export const getTimeZoneOffset = (date, timeZone) => {
    try {
        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone,
            timeZoneName: 'longOffset'
        }).formatToParts(date);
        return parts.find(p => p.type === 'timeZoneName')?.value || 'GMT+00:00';
    } catch (e) {
        return 'GMT+00:00';
    }
};

// Get local system timezone ID
export const getLocalTimeZone = () => {
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    } catch (e) {
        return 'UTC';
    }
};

// Convert a Date from one timezone to another, returning a fresh Date representing that wall clock time
export const convertDateTime = (date, fromTz, toTz) => {
    // We can do conversions by utilizing UTC timestamps
    // Convert source local date to its UTC timestamp using fromTz's current offset
    const sourceFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: fromTz,
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false
    });
    
    const parts = sourceFormatter.formatToParts(date);
    const getVal = type => parseInt(parts.find(p => p.type === type).value, 10);
    
    // This is the date-time as "wall time" in fromTz
    const year = getVal('year');
    const month = getVal('month') - 1;
    const day = getVal('day');
    const hour = getVal('hour') === 24 ? 0 : getVal('hour'); // handle 24:xx formatting if any
    const minute = getVal('minute');
    const second = getVal('second');

    // Return the converted time
    return new Date(Date.UTC(year, month, day, hour, minute, second));
};
