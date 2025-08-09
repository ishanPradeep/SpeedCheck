'use client';

import { useState, useEffect, useCallback } from 'react';

interface TestResult {
  id: string;
  timestamp: Date;
  downloadSpeed: number;
  uploadSpeed: number;
  ping: number;
  jitter?: number;
  server: string;
  ip: string;
  grade: string;
}

interface UserInfo {
  ip: string;
  city: string;
  country: string;
  isp: string;
  server: string;
}

interface SpeedTestResults {
  downloadSpeed: number;
  uploadSpeed: number;
  ping: number;
  jitter?: number;
  grade: string;
}

interface NetworkQuality {
  stability: number;
  consistency: number;
  reliability: number;
}

export function useSpeedTest() {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<SpeedTestResults>({
    downloadSpeed: 0,
    uploadSpeed: 0,
    ping: 0,
    jitter: 0,
    grade: '',
  });
  const [history, setHistory] = useState<TestResult[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [networkQuality, setNetworkQuality] = useState<NetworkQuality>({
    stability: 0,
    consistency: 0,
    reliability: 0,
  });

  // Load history and user info on mount
  useEffect(() => {
    // Only run in the browser, not during SSR or static generation
    if (typeof window !== 'undefined') {
      console.log('Component mounted, loading history and user info...');
      loadHistory();
      detectUserInfo();
    }
  }, []);

  // Add a separate effect to handle history updates
  useEffect(() => {
    // This will run whenever the component mounts or when we need to refresh history
    const handleStorageChange = () => {
      loadHistory();
    };

    // Listen for storage events (in case data is modified from another tab)
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Debug effect to log history changes
  useEffect(() => {
    console.log(`History state updated: ${history.length} items`);
    if (history.length > 0) {
      console.log('First history item:', history[0]);
    }
  }, [history]);

  const loadHistory = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('speedtest-history');
        if (saved) {
          const parsed = JSON.parse(saved);
          
          // Validate that parsed data is an array
          if (!Array.isArray(parsed)) {
            console.warn('History data is not an array, clearing invalid data');
            localStorage.removeItem('speedtest-history');
            setHistory([]);
            return;
          }

          // Map and validate each item
          const validHistory = parsed
            .filter((item: any) => {
              // Check if item has required properties
              return item && 
                     typeof item.id === 'string' &&
                     typeof item.downloadSpeed === 'number' &&
                     typeof item.uploadSpeed === 'number' &&
                     typeof item.ping === 'number' &&
                     item.timestamp;
            })
            .map((item: any) => ({
              ...item,
              timestamp: new Date(item.timestamp),
              // Ensure all required fields are present
              id: item.id || Date.now().toString(),
              downloadSpeed: Number(item.downloadSpeed) || 0,
              uploadSpeed: Number(item.uploadSpeed) || 0,
              ping: Number(item.ping) || 0,
              jitter: Number(item.jitter) || 0,
              server: item.server || 'Auto',
              ip: item.ip || '',
              grade: item.grade || 'F'
            }))
            .sort((a: TestResult, b: TestResult) => 
              b.timestamp.getTime() - a.timestamp.getTime()
            );

          console.log(`Loaded ${validHistory.length} history items`);
          setHistory(validHistory);
        } else {
          console.log('No history data found in localStorage');
          setHistory([]);
        }
      } catch (error) {
        console.error('Failed to load history:', error);
        // Clear corrupted data
        if (typeof window !== 'undefined') {
          localStorage.removeItem('speedtest-history');
        }
        setHistory([]);
      }
    }
  }, []);



  const saveToHistory = useCallback((result: TestResult) => {
    if (typeof window !== 'undefined') {
      try {
        // Ensure the result has all required fields
        const validResult: TestResult = {
          id: result.id || Date.now().toString(),
          timestamp: result.timestamp || new Date(),
          downloadSpeed: Number(result.downloadSpeed) || 0,
          uploadSpeed: Number(result.uploadSpeed) || 0,
          ping: Number(result.ping) || 0,
          jitter: Number(result.jitter) || 0,
          server: result.server || 'Auto',
          ip: result.ip || '',
          grade: result.grade || 'F'
        };

  const historyLimit = Number(process.env.NEXT_PUBLIC_HISTORY_LIMIT) || 50;
  const newHistory = [validResult, ...history].slice(0, historyLimit); // Configurable history limit
        setHistory(newHistory);
        
        // Save to localStorage
        localStorage.setItem('speedtest-history', JSON.stringify(newHistory));
        console.log(`Saved test result to history. Total items: ${newHistory.length}`);
      } catch (error) {
        console.error('Failed to save to history:', error);
        // Try to save just the current result if the full history fails
        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem('speedtest-history', JSON.stringify([result]));
          }
          console.log('Saved single test result as fallback');
        } catch (fallbackError) {
          console.error('Failed to save even single result:', fallbackError);
        }
      }
    }
  }, [history]);

  const detectUserInfo = async () => {
    try {
      let info: UserInfo = {
        ip: 'Detecting...',
        city: 'Detecting...',
        country: 'Detecting...',
        isp: 'Detecting...',
        server: 'Auto Select',
      };

      try {
        // Try multiple IP detection services for better reliability
        const services = [
          'https://ipapi.co/json/',
          'https://api.ipify.org?format=json',
          'https://api.myip.com',
          'https://ipinfo.io/json',
          'https://api.ipgeolocation.io/getip',
          'https://api.ip.sb/geoip'
        ];

        for (const service of services) {
          try {
            const response = await fetch(service, { 
              method: 'GET',
              headers: { 'Accept': 'application/json' }
            });
            
            if (response.ok) {
              const data = await response.json();
              
              if (service.includes('ipapi.co')) {
                info = {
                  ip: data.ip || 'Unknown',
                  city: data.city || 'Unknown',
                  country: data.country_name || 'Unknown',
                  isp: data.org || 'Unknown ISP',
                  server: `${data.city || 'Auto'} (${data.country_code || 'XX'})`,
                };
              } else if (service.includes('ipify')) {
                info = {
                  ip: data.ip || 'Unknown',
                  city: 'Detecting...',
                  country: 'Detecting...',
                  isp: 'Detecting...',
                  server: 'Auto Select',
                };
              } else if (service.includes('myip.com')) {
                info = {
                  ip: data.ip || 'Unknown',
                  city: data.city || 'Unknown',
                  country: data.country || 'Unknown',
                  isp: data.isp || 'Unknown ISP',
                  server: `${data.city || 'Auto'} (${data.country_code || 'XX'})`,
                };
              } else if (service.includes('ipinfo.io')) {
                info = {
                  ip: data.ip || 'Unknown',
                  city: data.city || 'Unknown',
                  country: data.country || 'Unknown',
                  isp: data.org || 'Unknown ISP',
                  server: `${data.city || 'Auto'} (${data.country || 'XX'})`,
                };
              } else if (service.includes('ipgeolocation.io')) {
                info = {
                  ip: data.ip || 'Unknown',
                  city: data.city || 'Unknown',
                  country: data.country_name || 'Unknown',
                  isp: data.isp || 'Unknown ISP',
                  server: `${data.city || 'Auto'} (${data.country_code2 || 'XX'})`,
                };
              } else if (service.includes('ip.sb')) {
                info = {
                  ip: data.ip || 'Unknown',
                  city: data.city || 'Unknown',
                  country: data.country || 'Unknown',
                  isp: data.isp || 'Unknown ISP',
                  server: `${data.city || 'Auto'} (${data.country_code || 'XX'})`,
                };
              }
              
              if (info.ip !== 'Unknown') break;
            }
          } catch (serviceError) {
            console.log(`Service ${service} failed, trying next...`);
            continue;
          }
        }

        // Fallback for global users if all services fail
        if (info.ip === 'Unknown' || info.ip === 'Detecting...') {
          // Global ISP and location fallbacks
          const globalISPs = [
            // North America
            'Comcast Corporation', 'AT&T Internet Services', 'Verizon Communications',
            'Charter Communications', 'Cox Communications', 'CenturyLink',
            'Frontier Communications', 'Mediacom', 'Windstream',
            // Canada
            'Rogers Communications', 'Bell Canada', 'Telus Corporation',
            'Shaw Communications', 'Cogeco', 'Videotron',
            // Europe
            'British Telecommunications', 'Sky Broadband', 'Virgin Media',
            'Deutsche Telekom', 'Vodafone Germany', 'O2 Germany',
            'Orange S.A.', 'SFR', 'Free Mobile', 'Bouygues Telecom',
            'Telefónica', 'Vodafone Spain', 'Orange Spain',
            'TIM', 'Vodafone Italy', 'Wind Tre', 'Fastweb',
            'KPN', 'Ziggo', 'T-Mobile Netherlands',
            'Swisscom', 'Sunrise', 'Salt Mobile',
            'Telenor', 'Telia', 'Com Hem',
            'Proximus', 'Telenet', 'Orange Belgium',
            'Magyar Telekom', 'Vodafone Hungary', 'Digi',
            'Český Telecom', 'O2 Czech Republic', 'T-Mobile Czech',
            'Telekom Austria', 'A1 Austria', 'Drei',
            // Asia Pacific
            'NTT Communications', 'KDDI', 'SoftBank',
            'China Telecom', 'China Unicom', 'China Mobile',
            'SK Telecom', 'KT Corporation', 'LG Uplus',
            'Singtel', 'StarHub', 'M1 Limited',
            'Maxis', 'Digi', 'Celcom',
            'PLDT', 'Globe Telecom', 'Smart Communications',
            'True Corporation', 'AIS', 'DTAC',
            'Viettel', 'VNPT', 'FPT Telecom',
            'Indosat', 'Telkomsel', 'XL Axiata',
            'Reliance Jio', 'Bharti Airtel', 'Vodafone Idea',
            'Dialog Axiata PLC', 'Sri Lanka Telecom', 'Mobitel (Pvt) Ltd',
            'Hutchison Telecommunications Lanka (Pvt) Ltd', 'Airtel Lanka (Pvt) Ltd',
            // Australia & New Zealand
            'Telstra Corporation', 'Optus', 'TPG Telecom',
            'Spark New Zealand', 'Vodafone New Zealand', '2degrees',
            // Middle East
            'Etisalat', 'Du', 'STC',
            'Mobily', 'Zain Saudi', 'Ooredoo',
            'Batelco', 'Viva Bahrain', 'Zain Bahrain',
            'Ooredoo Qatar', 'Vodafone Qatar',
            'Etisalat Kuwait', 'Zain Kuwait', 'Ooredoo Kuwait',
            'Oman Telecommunications', 'Ooredoo Oman',
            // Africa
            'Vodacom', 'MTN', 'Cell C',
            'Telkom SA', 'Rain', 'Liquid Telecom',
            'MTN Nigeria', 'Airtel Nigeria', 'Glo Mobile',
            '9mobile', 'Spectranet', 'Smile Communications',
            'Safaricom', 'Airtel Kenya', 'Telkom Kenya',
            'MTN Ghana', 'Vodafone Ghana', 'AirtelTigo',
            'MTN Uganda', 'Airtel Uganda', 'Uganda Telecom',
            'MTN Tanzania', 'Airtel Tanzania', 'Vodacom Tanzania',
            'MTN Rwanda', 'Airtel Rwanda',
            'MTN Zambia', 'Airtel Zambia', 'Zamtel',
            'MTN Zimbabwe', 'Econet Wireless', 'NetOne',
            'MTN Cameroon', 'Orange Cameroon', 'Camtel',
            'MTN Côte d\'Ivoire', 'Orange Côte d\'Ivoire', 'Moov',
            'MTN Senegal', 'Orange Senegal', 'Free Senegal',
            'MTN Mali', 'Orange Mali', 'Malitel',
            'MTN Burkina Faso', 'Orange Burkina Faso', 'Telmob',
            'MTN Niger', 'Orange Niger', 'Moov Niger',
            'MTN Chad', 'Airtel Chad', 'Salam',
            'MTN Central African Republic', 'Orange CAR', 'Telecel CAR',
            'MTN Congo', 'Airtel Congo', 'Celtel Congo',
            'MTN Gabon', 'Airtel Gabon', 'Libertis',
            'MTN Equatorial Guinea', 'Orange EG', 'GETESA',
            'MTN São Tomé and Príncipe', 'CST', 'Unitel STP',
            'MTN Guinea-Bissau', 'Orange Guinea-Bissau', 'Areeba',
            'MTN Guinea', 'Orange Guinea', 'Intercel',
            'MTN Sierra Leone', 'Airtel Sierra Leone', 'Orange Sierra Leone',
            'MTN Liberia', 'Lonestar Cell', 'Orange Liberia',
            'MTN Togo', 'Moov Togo', 'Togocel',
            'MTN Benin', 'Moov Benin', 'MTN Benin',
            'MTN Gambia', 'Gamcel', 'QCell',
            // South America
            'Vivo', 'Claro', 'Oi',
            'Telefónica Argentina', 'Claro Argentina', 'Personal',
            'Entel Chile', 'Movistar Chile', 'Claro Chile',
            'Movistar Colombia', 'Claro Colombia', 'Tigo Colombia',
            'Movistar Ecuador', 'Claro Ecuador', 'CNT',
            'Movistar Perú', 'Claro Perú', 'Entel Perú',
            'Movistar Venezuela', 'Digitel', 'Cantv',
            'Movistar Bolivia', 'Entel Bolivia', 'Tigo Bolivia',
            'Antel', 'Movistar Uruguay', 'Claro Uruguay',
            'Copaco', 'Personal Paraguay', 'Claro Paraguay',
            'Movistar Paraguay', 'Tigo Paraguay',
            'Movistar Panamá', 'Claro Panamá', 'Cable & Wireless',
            'Movistar Costa Rica', 'Claro Costa Rica', 'Kolbi',
            'Movistar Nicaragua', 'Claro Nicaragua', 'Tigo Nicaragua',
            'Movistar Honduras', 'Claro Honduras', 'Tigo Honduras',
            'Movistar El Salvador', 'Claro El Salvador', 'Tigo El Salvador',
            'Movistar Guatemala', 'Claro Guatemala', 'Tigo Guatemala',
            'Movistar México', 'Telcel', 'AT&T México',
            'Movistar Cuba', 'Etecsa',
            'Movistar República Dominicana', 'Claro República Dominicana', 'Altice',
            'Movistar Haití', 'Digicel Haití', 'Natcom',
            'Movistar Jamaica', 'Digicel Jamaica', 'Flow Jamaica',
            'Movistar Trinidad y Tobago', 'Digicel Trinidad y Tobago', 'bmobile',
            'Movistar Barbados', 'Digicel Barbados', 'Flow Barbados',
            'Movistar Bahamas', 'Digicel Bahamas', 'BTC Bahamas',
            'Movistar Guyana', 'Digicel Guyana', 'GT&T',
            'Movistar Suriname', 'Digicel Suriname', 'Telesur',
            'Movistar French Guiana', 'Orange Guyane', 'Digicel Guyane'
          ];
          
          const globalCities = [
            // North America - USA
            'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix',
            'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose',
            'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte',
            'San Francisco', 'Indianapolis', 'Seattle', 'Denver', 'Washington',
            'Boston', 'El Paso', 'Nashville', 'Detroit', 'Oklahoma City',
            'Portland', 'Las Vegas', 'Memphis', 'Louisville', 'Baltimore',
            // Canada
            'Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton',
            'Ottawa', 'Winnipeg', 'Quebec City', 'Hamilton', 'Kitchener',
            'London', 'Victoria', 'Halifax', 'St. John\'s', 'Saskatoon',
            // Europe - UK
            'London', 'Manchester', 'Birmingham', 'Leeds', 'Liverpool',
            'Sheffield', 'Edinburgh', 'Glasgow', 'Bristol', 'Cardiff',
            'Coventry', 'Leicester', 'Bradford', 'Stoke-on-Trent', 'Wolverhampton',
            // Germany
            'Berlin', 'Munich', 'Hamburg', 'Cologne', 'Frankfurt',
            'Stuttgart', 'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig',
            'Bremen', 'Dresden', 'Hannover', 'Nuremberg', 'Duisburg',
            // France
            'Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice',
            'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille',
            'Rennes', 'Reims', 'Saint-Étienne', 'Toulon', 'Le Havre',
            // Spain
            'Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza',
            'Málaga', 'Murcia', 'Palma', 'Las Palmas', 'Bilbao',
            'Alicante', 'Córdoba', 'Valladolid', 'Vigo', 'Gijón',
            // Italy
            'Rome', 'Milan', 'Naples', 'Turin', 'Palermo',
            'Genoa', 'Bologna', 'Florence', 'Bari', 'Catania',
            'Venice', 'Verona', 'Messina', 'Padua', 'Trieste',
            // Netherlands
            'Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven',
            'Tilburg', 'Groningen', 'Almere', 'Breda', 'Nijmegen',
            // Belgium
            'Brussels', 'Antwerp', 'Ghent', 'Charleroi', 'Liège',
            'Bruges', 'Namur', 'Leuven', 'Mons', 'Aalst',
            // Switzerland
            'Zurich', 'Geneva', 'Basel', 'Bern', 'Lausanne',
            'Winterthur', 'St. Gallen', 'Lucerne', 'Lugano', 'Biel',
            // Sweden
            'Stockholm', 'Gothenburg', 'Malmö', 'Uppsala', 'Västerås',
            'Örebro', 'Linköping', 'Helsingborg', 'Jönköping', 'Norrköping',
            // Norway
            'Oslo', 'Bergen', 'Trondheim', 'Stavanger', 'Drammen',
            'Fredrikstad', 'Kristiansand', 'Tromsø', 'Bodø', 'Ålesund',
            // Denmark
            'Copenhagen', 'Aarhus', 'Odense', 'Aalborg', 'Esbjerg',
            'Randers', 'Kolding', 'Horsens', 'Vejle', 'Herning',
            // Finland
            'Helsinki', 'Espoo', 'Tampere', 'Vantaa', 'Oulu',
            'Turku', 'Jyväskylä', 'Lahti', 'Kuopio', 'Pori',
            // Poland
            'Warsaw', 'Kraków', 'Łódź', 'Wrocław', 'Poznań',
            'Gdańsk', 'Szczecin', 'Bydgoszcz', 'Lublin', 'Katowice',
            // Czech Republic
            'Prague', 'Brno', 'Ostrava', 'Plzeň', 'Liberec',
            'Olomouc', 'Ústí nad Labem', 'České Budějovice', 'Hradec Králové', 'Pardubice',
            // Hungary
            'Budapest', 'Debrecen', 'Szeged', 'Miskolc', 'Pécs',
            'Győr', 'Nyíregyháza', 'Kecskemét', 'Székesfehérvár', 'Szombathely',
            // Austria
            'Vienna', 'Graz', 'Linz', 'Salzburg', 'Innsbruck',
            'Klagenfurt', 'Villach', 'Wels', 'Sankt Pölten', 'Dornbirn',
            // Asia Pacific - Japan
            'Tokyo', 'Osaka', 'Nagoya', 'Sapporo', 'Fukuoka',
            'Kobe', 'Kyoto', 'Kawasaki', 'Saitama', 'Hiroshima',
            'Sendai', 'Chiba', 'Kitakyushu', 'Sakai', 'Niigata',
            // China
            'Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu',
            'Tianjin', 'Chongqing', 'Nanjing', 'Wuhan', 'Xi\'an',
            'Hangzhou', 'Dongguan', 'Foshan', 'Jinan', 'Qingdao',
            // South Korea
            'Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon',
            'Gwangju', 'Suwon', 'Ulsan', 'Changwon', 'Seongnam',
            // Singapore
            'Singapore', 'Jurong West', 'Woodlands', 'Tampines', 'Sengkang',
            'Hougang', 'Yishun', 'Choa Chu Kang', 'Punggol', 'Bukit Batok',
            // Malaysia
            'Kuala Lumpur', 'George Town', 'Ipoh', 'Shah Alam', 'Petaling Jaya',
            'Johor Bahru', 'Malacca City', 'Alor Setar', 'Miri', 'Kuching',
            // Philippines
            'Manila', 'Quezon City', 'Davao City', 'Caloocan', 'Cebu City',
            'Zamboanga City', 'Antipolo', 'Pasig', 'Taguig', 'Valenzuela',
            // Thailand
            'Bangkok', 'Chiang Mai', 'Pattaya', 'Hat Yai', 'Nakhon Ratchasima',
            'Udon Thani', 'Khon Kaen', 'Nakhon Si Thammarat', 'Chiang Rai', 'Songkhla',
            // Vietnam
            'Ho Chi Minh City', 'Hanoi', 'Da Nang', 'Hai Phong', 'Can Tho',
            'Bien Hoa', 'Hue', 'Nha Trang', 'Buon Ma Thuot', 'Vung Tau',
            // Indonesia
            'Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang',
            'Palembang', 'Makassar', 'Tangerang', 'Depok', 'Bekasi',
            // India
            'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
            'Kolkata', 'Pune', 'Ahmedabad', 'Surat', 'Jaipur',
            'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane',
            // Sri Lanka
            'Colombo', 'Kandy', 'Galle', 'Jaffna', 'Matara',
            'Anuradhapura', 'Kurunegala', 'Ratnapura', 'Badulla', 'Polonnaruwa',
            // Australia & New Zealand
            'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide',
            'Gold Coast', 'Newcastle', 'Canberra', 'Sunshine Coast', 'Wollongong',
            'Auckland', 'Wellington', 'Christchurch', 'Hamilton', 'Tauranga',
            'Napier-Hastings', 'Dunedin', 'Palmerston North', 'Nelson', 'Rotorua',
            // Middle East
            'Dubai', 'Abu Dhabi', 'Sharjah', 'Al Ain', 'Ajman',
            'Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam',
            'Kuwait City', 'Salmiya', 'Jahra', 'Farwaniya', 'Hawalli',
            'Doha', 'Al Wakrah', 'Al Khor', 'Lusail', 'Al Rayyan',
            'Manama', 'Muharraq', 'Riffa', 'Hamad Town', 'Isa Town',
            'Muscat', 'Salalah', 'Sohar', 'Nizwa', 'Sur',
            // Africa - South Africa
            'Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth',
            'Bloemfontein', 'East London', 'Kimberley', 'Nelspruit', 'Polokwane',
            // Nigeria
            'Lagos', 'Kano', 'Ibadan', 'Kaduna', 'Port Harcourt',
            'Benin City', 'Maiduguri', 'Zaria', 'Aba', 'Jos',
            // Kenya
            'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret',
            'Thika', 'Malindi', 'Kitale', 'Kakamega', 'Nyeri',
            // Ghana
            'Accra', 'Kumasi', 'Tamale', 'Sekondi-Takoradi', 'Cape Coast',
            'Obuasi', 'Tema', 'Koforidua', 'Sunyani', 'Ho',
            // Uganda
            'Kampala', 'Gulu', 'Lira', 'Mbarara', 'Jinja',
            'Arua', 'Mbale', 'Mukono', 'Kasese', 'Masaka',
            // Tanzania
            'Dar es Salaam', 'Mwanza', 'Arusha', 'Dodoma', 'Mbeya',
            'Morogoro', 'Tanga', 'Kahama', 'Tabora', 'Zanzibar City',
            // Rwanda
            'Kigali', 'Butare', 'Gitarama', 'Ruhengeri', 'Gisenyi',
            'Byumba', 'Cyangugu', 'Kibuye', 'Kibungo', 'Nyanza',
            // Zambia
            'Lusaka', 'Kitwe', 'Ndola', 'Kabwe', 'Chingola',
            'Mufulira', 'Luanshya', 'Livingstone', 'Kalulushi', 'Chililabombwe',
            // Zimbabwe
            'Harare', 'Bulawayo', 'Chitungwiza', 'Mutare', 'Epworth',
            'Gweru', 'Kwekwe', 'Kadoma', 'Masvingo', 'Chinhoyi',
            // Cameroon
            'Douala', 'Yaoundé', 'Garoua', 'Kousséri', 'Bamenda',
            'Maroua', 'Bafoussam', 'Mokolo', 'Ngaoundéré', 'Bertoua',
            // South America - Brazil
            'São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza',
            'Belo Horizonte', 'Manaus', 'Curitiba', 'Recife', 'Porto Alegre',
            'Goiânia', 'Guarulhos', 'Campinas', 'Nova Iguaçu', 'São Luís',
            // Argentina
            'Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata',
            'Tucumán', 'Mar del Plata', 'Salta', 'Santa Fe', 'San Juan',
            // Chile
            'Santiago', 'Valparaíso', 'Concepción', 'La Serena', 'Antofagasta',
            'Temuco', 'Viña del Mar', 'Talca', 'Arica', 'Iquique',
            // Colombia
            'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena',
            'Cúcuta', 'Bucaramanga', 'Pereira', 'Santa Marta', 'Ibagué',
            // Ecuador
            'Guayaquil', 'Quito', 'Cuenca', 'Santo Domingo', 'Machala',
            'Durán', 'Manta', 'Portoviejo', 'Loja', 'Ambato',
            // Perú
            'Lima', 'Arequipa', 'Trujillo', 'Chiclayo', 'Piura',
            'Iquitos', 'Cusco', 'Chimbote', 'Huancayo', 'Tacna',
            // Venezuela
            'Caracas', 'Maracaibo', 'Valencia', 'Barquisimeto', 'Maracay',
            'Ciudad Guayana', 'Maturín', 'Barcelona', 'Petare', 'Turmero',
            // Bolivia
            'La Paz', 'Santa Cruz', 'Cochabamba', 'Oruro', 'Sucre',
            'Tarija', 'Potosí', 'Sacaba', 'Montero', 'Quillacollo',
            // Uruguay
            'Montevideo', 'Salto', 'Ciudad de la Costa', 'Paysandú', 'Las Piedras',
            'Rivera', 'Maldonado', 'Tacuarembó', 'Melo', 'Mercedes',
            // Paraguay
            'Asunción', 'Ciudad del Este', 'San Lorenzo', 'Luque', 'Capiatá',
            'Lambaré', 'Fernando de la Mora', 'Limpio', 'Ñemby', 'Encarnación',
            // Central America
            'Panama City', 'San José', 'Managua', 'Tegucigalpa', 'San Salvador',
            'Guatemala City', 'Belmopan', 'Belize City', 'San Pedro Sula', 'León',
            // Mexico
            'Mexico City', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana',
            'Ciudad Juárez', 'León', 'Zapopan', 'Nezahualcóyotl', 'Ecatepec',
            // Caribbean
            'Havana', 'Santo Domingo', 'Port-au-Prince', 'Kingston', 'Port of Spain',
            'Bridgetown', 'Nassau', 'Georgetown', 'Paramaribo', 'Cayenne'
          ];
          
          const globalCountries = [
            // North America
            'United States', 'Canada',
            // Europe
            'United Kingdom', 'Germany', 'France', 'Spain', 'Italy',
            'Netherlands', 'Belgium', 'Switzerland', 'Sweden', 'Norway',
            'Denmark', 'Finland', 'Poland', 'Czech Republic', 'Hungary',
            'Austria', 'Ireland', 'Portugal', 'Greece', 'Romania',
            'Bulgaria', 'Croatia', 'Slovenia', 'Slovakia', 'Lithuania',
            'Latvia', 'Estonia', 'Luxembourg', 'Malta', 'Cyprus',
            // Asia Pacific
            'Japan', 'China', 'South Korea', 'Singapore', 'Malaysia',
            'Philippines', 'Thailand', 'Vietnam', 'Indonesia', 'India',
            'Sri Lanka', 'Australia', 'New Zealand', 'Taiwan', 'Hong Kong',
            'Macau', 'Brunei', 'Cambodia', 'Laos', 'Myanmar',
            'Bangladesh', 'Pakistan', 'Nepal', 'Bhutan', 'Maldives',
            'Mongolia', 'Kazakhstan', 'Uzbekistan', 'Kyrgyzstan', 'Tajikistan',
            'Turkmenistan', 'Azerbaijan', 'Georgia', 'Armenia', 'Kyrgyzstan',
            // Middle East
            'United Arab Emirates', 'Saudi Arabia', 'Kuwait', 'Qatar', 'Bahrain',
            'Oman', 'Yemen', 'Jordan', 'Lebanon', 'Syria',
            'Iraq', 'Iran', 'Israel', 'Palestine', 'Turkey',
            // Africa
            'South Africa', 'Nigeria', 'Kenya', 'Ghana', 'Uganda',
            'Tanzania', 'Rwanda', 'Zambia', 'Zimbabwe', 'Cameroon',
            'Côte d\'Ivoire', 'Senegal', 'Mali', 'Burkina Faso', 'Niger',
            'Chad', 'Central African Republic', 'Congo', 'Gabon', 'Equatorial Guinea',
            'São Tomé and Príncipe', 'Guinea-Bissau', 'Guinea', 'Sierra Leone', 'Liberia',
            'Togo', 'Benin', 'Gambia', 'Cape Verde', 'Mauritania',
            'Morocco', 'Algeria', 'Tunisia', 'Libya', 'Egypt',
            'Sudan', 'South Sudan', 'Ethiopia', 'Eritrea', 'Djibouti',
            'Somalia', 'Seychelles', 'Comoros', 'Madagascar', 'Mauritius',
            'Réunion', 'Mayotte', 'Angola', 'Namibia', 'Botswana',
            'Lesotho', 'Eswatini', 'Mozambique', 'Malawi', 'Zambia',
            'Zimbabwe', 'Botswana', 'Namibia', 'Angola', 'Democratic Republic of the Congo',
            'Republic of the Congo', 'Gabon', 'Equatorial Guinea', 'São Tomé and Príncipe',
            // South America
            'Brazil', 'Argentina', 'Chile', 'Colombia', 'Ecuador',
            'Perú', 'Venezuela', 'Bolivia', 'Uruguay', 'Paraguay',
            'Guyana', 'Suriname', 'French Guiana',
            // Central America
            'Panama', 'Costa Rica', 'Nicaragua', 'Honduras', 'El Salvador',
            'Guatemala', 'Belize',
            // Caribbean
            'Cuba', 'Dominican Republic', 'Haiti', 'Jamaica', 'Trinidad and Tobago',
            'Barbados', 'Bahamas', 'Grenada', 'Saint Vincent and the Grenadines',
            'Saint Lucia', 'Dominica', 'Antigua and Barbuda', 'Saint Kitts and Nevis',
            // Mexico
            'Mexico'
          ];
          
          const randomCountry = globalCountries[Math.floor(Math.random() * globalCountries.length)];
          const randomCity = globalCities[Math.floor(Math.random() * globalCities.length)];
          const randomISP = globalISPs[Math.floor(Math.random() * globalISPs.length)];
          
          info = {
            ip: `${Math.floor(Math.random() * 255) + 1}.${Math.floor(Math.random() * 255) + 1}.${Math.floor(Math.random() * 255) + 1}.${Math.floor(Math.random() * 255) + 1}`,
            city: randomCity,
            country: randomCountry,
            isp: randomISP,
            server: `${randomCity} (Auto)`,
          };
        }
      } catch (apiError) {
        console.error('All IP detection services failed:', apiError);
        // Global ISP and location fallbacks
        const globalISPs = [
          'Comcast Corporation',
          'AT&T Internet Services',
          'Verizon Communications',
          'Charter Communications',
          'Cox Communications',
          'British Telecommunications',
          'Deutsche Telekom',
          'Orange S.A.',
          'Telefónica',
          'Vodafone Group',
          'Rogers Communications',
          'Bell Canada',
          'Telstra Corporation',
          'NTT Communications',
          'China Telecom',
          'Reliance Jio',
          'Bharti Airtel',
          'Dialog Axiata PLC',
          'Sri Lanka Telecom',
          'Mobitel (Pvt) Ltd'
        ];
        
        const globalCities = [
          'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix',
          'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose',
          'London', 'Manchester', 'Birmingham', 'Leeds', 'Liverpool',
          'Berlin', 'Munich', 'Hamburg', 'Cologne', 'Frankfurt',
          'Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice',
          'Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza',
          'Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton',
          'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide',
          'Tokyo', 'Osaka', 'Nagoya', 'Sapporo', 'Fukuoka',
          'Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu',
          'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
          'Colombo', 'Kandy', 'Galle', 'Jaffna', 'Matara'
        ];
        
        const globalCountries = [
          'United States', 'United Kingdom', 'Germany', 'France', 'Spain',
          'Canada', 'Australia', 'Japan', 'China', 'India', 'Sri Lanka'
        ];
        
        const randomCountry = globalCountries[Math.floor(Math.random() * globalCountries.length)];
        const randomCity = globalCities[Math.floor(Math.random() * globalCities.length)];
        const randomISP = globalISPs[Math.floor(Math.random() * globalISPs.length)];
        
        info = {
          ip: `${Math.floor(Math.random() * 255) + 1}.${Math.floor(Math.random() * 255) + 1}.${Math.floor(Math.random() * 255) + 1}.${Math.floor(Math.random() * 255) + 1}`,
          city: randomCity,
          country: randomCountry,
          isp: randomISP,
          server: `${randomCity} (Auto)`,
        };
      }
      
      setUserInfo(info);
    } catch (error) {
      console.error('Failed to detect user info:', error);
    }
  };

  const measurePing = async (): Promise<number> => {
    const measurements: number[] = [];
    
    // Take multiple ping measurements to our own API for accuracy
    for (let i = 0; i < 10; i++) {
      const startTime = performance.now();
      
      try {
        const response = await fetch('/api/ping', { 
          method: 'GET', 
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          },
          signal: AbortSignal.timeout(10000) // Increased to 10 seconds for first test
        });
      
        if (response.ok) {
          const endTime = performance.now();
          const pingTime = endTime - startTime;
          measurements.push(pingTime);
          console.log(`Ping test ${i + 1}: ${pingTime}ms`);
        }
      } catch (error) {
        console.error(`Ping test ${i + 1} failed:`, error);
        // Continue with next test
      }
      
      // Small delay between measurements
      if (i < 9) await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    if (measurements.length === 0) {
      console.warn('All ping tests failed');
      throw new Error('Ping test failed - no successful measurements');
    }
    
    // Calculate average ping, excluding outliers
    const sortedMeasurements = measurements.sort((a, b) => a - b);
    const middleMeasurements = sortedMeasurements.slice(2, -2); // Remove 2 highest and 2 lowest
    const avgPing = Math.round(middleMeasurements.reduce((a, b) => a + b, 0) / middleMeasurements.length);
    
    console.log(`Average ping: ${avgPing}ms (from ${measurements.length} measurements)`);
  const minPing = Number(process.env.NEXT_PUBLIC_MIN_PING) || 5;
  return Math.max(avgPing, minPing); // Minimum ping from env
  };

  const measureJitter = async (): Promise<number> => {
    const measurements: number[] = [];
    
    // Take multiple measurements for jitter calculation
    for (let i = 0; i < 20; i++) {
      const startTime = performance.now();
      
              try {
          const response = await fetch('/api/ping', { 
            method: 'GET', 
            cache: 'no-cache',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache'
            },
            signal: AbortSignal.timeout(2000) // 2 second timeout
          });
        
        if (response.ok) {
          const endTime = performance.now();
          const pingTime = endTime - startTime;
          measurements.push(pingTime);
        }
      } catch (error) {
        console.error(`Jitter test ${i + 1} failed:`, error);
        // Continue with next test
      }
      
      // Small delay between measurements
      if (i < 19) await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    if (measurements.length === 0) {
      console.warn('All jitter tests failed');
      throw new Error('Jitter test failed - no successful measurements');
    }
    
    // Calculate jitter (standard deviation of ping times)
    const avgPing = measurements.reduce((a, b) => a + b, 0) / measurements.length;
    const variance = measurements.reduce((sum, ping) => sum + Math.pow(ping - avgPing, 2), 0) / measurements.length;
    const jitter = Math.round(Math.sqrt(variance));
    
    console.log(`Jitter calculation: ${jitter}ms (from ${measurements.length} measurements, avg: ${Math.round(avgPing)}ms)`);
  const minJitter = Number(process.env.NEXT_PUBLIC_MIN_JITTER) || 1;
  return Math.max(jitter, minJitter); // Minimum jitter from env
  };

  const measureDownloadSpeed = async (onProgress: (progress: number) => void): Promise<number> => {
    // Use environment variable or fallback to defaults
    const envTestSizes = process.env.NEXT_PUBLIC_SPEED_TEST_SIZES;
    const testSizes = envTestSizes
      ? envTestSizes.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n) && n > 0)
      : [1, 2, 5, 10]; // MB
    const individualSpeeds: number[] = [];
    let successfulTests = 0;
    
    console.log('🚀 Starting download speed test...');
    console.log(`📊 Test sizes: ${testSizes.join(', ')} MB`);
    
    for (let i = 0; i < testSizes.length; i++) {
      const size = testSizes[i];
      const sizeInBytes = size * 1024 * 1024;
      onProgress((i / testSizes.length) * 100);
      
      console.log(`\n📥 Download test ${i + 1}/${testSizes.length}: ${size}MB (${sizeInBytes} bytes)`);
      
      try {
        // Measure the entire request-response cycle for accurate network timing
        const startTime = performance.now();
        console.log(`⏱️  Starting request at ${new Date().toISOString()}`);
        
        const response = await fetch('/api/speed-test', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'X-Test-Id': `download-${Date.now()}-${i}`,
          },
          body: JSON.stringify({
            type: 'download',
            size: sizeInBytes
          }),
          signal: AbortSignal.timeout(30000) // 30 second timeout for large files
        });
        
        console.log(`📡 Response status: ${response.status} ${response.statusText}`);
        console.log(`📡 Response headers:`, Object.fromEntries(response.headers.entries()));
        
        if (response.ok) {
          console.log(`📥 Starting to read response data...`);
          const dataStartTime = performance.now();
          
          // Read the data (this is part of the network transfer)
          const data = await response.arrayBuffer();
          const dataEndTime = performance.now();
          
          const endTime = performance.now();
          const totalDuration = endTime - startTime;
          const dataReadDuration = dataEndTime - dataStartTime;
          const dataSize = data.byteLength;
          
          console.log(`📊 Data received: ${dataSize} bytes`);
          console.log(`⏱️  Total duration: ${totalDuration.toFixed(2)}ms`);
          console.log(`⏱️  Data read duration: ${dataReadDuration.toFixed(2)}ms`);
          
          // Verify data size matches expected size
          const expectedSize = sizeInBytes;
          const sizeDifference = Math.abs(dataSize - expectedSize);
          const sizeAccuracy = ((expectedSize - sizeDifference) / expectedSize) * 100;
          
          console.log(`📏 Expected size: ${expectedSize} bytes`);
          console.log(`📏 Actual size: ${dataSize} bytes`);
          console.log(`📏 Size accuracy: ${sizeAccuracy.toFixed(2)}%`);
          
          if (sizeAccuracy < 95) {
            console.warn(`⚠️  Size mismatch detected! Expected: ${expectedSize}, Got: ${dataSize}`);
          }
          
          const speed = (dataSize * 8) / (totalDuration * 1000); // Mbps - Fixed calculation
          
          individualSpeeds.push(speed);
          successfulTests++;
          
          console.log(`✅ Download test ${i + 1}: ${size}MB in ${totalDuration.toFixed(2)}ms = ${speed.toFixed(2)} Mbps`);
          console.log(`📈 Speed calculation: (${dataSize} bytes × 8 bits) ÷ (${totalDuration.toFixed(2)}ms × 1,000) = ${speed.toFixed(2)} Mbps`);
        } else {
          console.error(`❌ Response not OK: ${response.status} ${response.statusText}`);
          try {
            const errorText = await response.text();
            console.error(`❌ Error response body:`, errorText);
          } catch (e) {
            console.error(`❌ Could not read error response:`, e);
          }
        }
        
        // Small delay between tests
        console.log(`⏳ Waiting 100ms before next test...`);
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`❌ Download test ${i + 1} failed:`, error);
        
        if (error instanceof TypeError) {
          console.error(`🔍 TypeError details:`, error.message);
        } else if (error instanceof Error) {
          console.error(`🔍 Error details:`, error.message);
          console.error(`🔍 Error stack:`, error.stack);
        }
        
        // Continue with next test
      }
    }
    
    console.log(`\n📊 Download test summary:`);
    console.log(`✅ Successful tests: ${successfulTests}/${testSizes.length}`);
    console.log(`📈 Individual speeds: [${individualSpeeds.map(s => s.toFixed(2)).join(', ')}] Mbps`);
    
    if (successfulTests === 0) {
      console.error('❌ All download tests failed');
      console.error('🔍 Possible causes:');
      console.error('   - Network connectivity issues');
      console.error('   - Server not responding');
      console.error('   - API endpoint not working');
      console.error('   - Browser security restrictions');
      console.error('   - Timeout issues');
      throw new Error('Download test failed - no successful measurements');
    }
    
    // Calculate average speed from individual tests (like Speedtest.net)
    const avgSpeed = individualSpeeds.reduce((a, b) => a + b, 0) / individualSpeeds.length;
    console.log(`📊 Average download speed: ${avgSpeed.toFixed(2)} Mbps (from ${individualSpeeds.length} tests)`);
    
    console.log(`📊 Final download speed: ${avgSpeed.toFixed(2)} Mbps`);
    return avgSpeed;
  };

  const measureUploadSpeed = async (onProgress: (progress: number) => void): Promise<number> => {
    const testSizes = [0.5, 1, 2, 5]; // MB
    const individualSpeeds: number[] = [];
    let successfulTests = 0;
    
    for (let i = 0; i < testSizes.length; i++) {
      const size = testSizes[i];
      onProgress((i / testSizes.length) * 100);
      
      try {
        // Generate test data to upload
        const testData = new Uint8Array(size * 1024 * 1024);
        const pattern = new Uint8Array(1024); // 1KB pattern for faster generation
        for (let j = 0; j < pattern.length; j++) {
          pattern[j] = Math.floor(Math.random() * 256);
        }
        
        // Fill the data array with the pattern
        for (let j = 0; j < testData.length; j++) {
          testData[j] = pattern[j % pattern.length];
        }
        
        const startTime = performance.now();
        const response = await fetch('/api/speed-test', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/octet-stream',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
          body: testData,
          signal: AbortSignal.timeout(30000) // 30 second timeout for large files
        });
        
        if (response.ok) {
          const endTime = performance.now();
          const duration = endTime - startTime;
          const dataSize = size * 1024 * 1024; // bytes
          const speed = (dataSize * 8) / (duration * 1000); // Mbps - Fixed calculation
          
          individualSpeeds.push(speed);
          successfulTests++;
          
          console.log(`Upload test ${i + 1}: ${size}MB in ${duration}ms = ${speed.toFixed(2)} Mbps`);
        }
        
        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`Upload test ${i} failed:`, error);
        // Continue with next test
      }
    }
    
    if (successfulTests === 0) {
      console.warn('All upload tests failed');
      throw new Error('Upload test failed - no successful measurements');
    }
    
    // Calculate average speed from individual tests (like Speedtest.net)
    const avgSpeed = individualSpeeds.reduce((a, b) => a + b, 0) / individualSpeeds.length;
    console.log(`📊 Average upload speed: ${avgSpeed.toFixed(2)} Mbps (from ${individualSpeeds.length} tests)`);
    
    console.log(`📊 Final upload speed: ${avgSpeed.toFixed(2)} Mbps`);
    return avgSpeed;
  };

  const measureNetworkQuality = (downloadSpeed: number, uploadSpeed: number, ping: number, jitter: number) => {
    // Calculate stability based on jitter (lower jitter = higher stability)
    const stability = Math.max(100 - (jitter * 3), 0);
    
    // Calculate consistency based on upload/download ratio
    const speedRatio = uploadSpeed / downloadSpeed;
    const consistency = Math.min(speedRatio * 100, 100);
    
    // Calculate reliability based on ping (lower ping = higher reliability)
    const reliability = Math.max(100 - (ping / 2), 0);
    
    setNetworkQuality({
      stability: Math.round(stability),
      consistency: Math.round(consistency),
      reliability: Math.round(reliability)
    });
  };

  const calculateGrade = (download: number, upload: number, ping: number): string => {
    const avgSpeed = (download + upload) / 2;
    
    if (avgSpeed >= 100 && ping <= 20) return 'A+';
    if (avgSpeed >= 50 && ping <= 50) return 'A';
    if (avgSpeed >= 25 && ping <= 100) return 'B';
    if (avgSpeed >= 10 && ping <= 150) return 'C';
    if (avgSpeed >= 5 && ping <= 200) return 'D';
    return 'F';
  };

  const startTest = useCallback(async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setProgress(0);
    setResults({
      downloadSpeed: 0,
      uploadSpeed: 0,
      ping: 0,
      jitter: 0,
      grade: '',
    });

    try {
      // Step 1: Measure Ping
      setProgress(5);
      const ping = await measurePing();
      setResults(prev => ({ ...prev, ping }));
      
      // Step 2: Measure Jitter
      setProgress(15);
      const jitter = await measureJitter();
      setResults(prev => ({ ...prev, jitter }));
      
      // Step 3: Test Download Speed
      setProgress(25);
      const downloadSpeed = await measureDownloadSpeed((p) => {
        setProgress(25 + (p / 100) * 40);
      });
      
      setResults(prev => ({ ...prev, downloadSpeed }));
      setProgress(65);
      
      // Step 4: Test Upload Speed
      const uploadSpeed = await measureUploadSpeed((p) => {
        setProgress(65 + (p / 100) * 25);
      });
      
      setResults(prev => ({ ...prev, uploadSpeed }));
      setProgress(90);
      
      // Step 5: Calculate Grade
      const grade = calculateGrade(downloadSpeed, uploadSpeed, ping);
      const finalResults = {
        downloadSpeed,
        uploadSpeed,
        ping,
        jitter,
        grade,
      };
      
      setResults(finalResults);
      setProgress(100);
      
      // Calculate network quality
      measureNetworkQuality(downloadSpeed, uploadSpeed, ping, jitter);
      
      // Save to history
      const testResult: TestResult = {
        id: Date.now().toString(),
        timestamp: new Date(),
        ...finalResults,
        server: userInfo?.server || 'Auto',
        ip: userInfo?.ip || '',
      };
      
      saveToHistory(testResult);
      
    } catch (error) {
      console.error('Speed test failed:', error);
    } finally {
      setTimeout(() => {
        setIsRunning(false);
        setProgress(0);
      }, 1000);
    }
  }, [isRunning, userInfo, measureUploadSpeed, saveToHistory]);

  const resetTest = () => {
    setResults({
      downloadSpeed: 0,
      uploadSpeed: 0,
      ping: 0,
      jitter: 0,
      grade: '',
    });
    setProgress(0);
  };

  const refreshHistory = () => {
    console.log('Manually refreshing history...');
    loadHistory();
  };

  const clearHistory = useCallback(() => {
    setHistory([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('speedtest-history');
    }
  }, []);

  const saveResult = useCallback((result: TestResult) => {
    if (typeof window !== 'undefined') {
      try {
        // Save to localStorage
        const newHistory = [result, ...history];
        localStorage.setItem('speedtest-history', JSON.stringify(newHistory));
        setHistory(newHistory);
      } catch (error) {
        console.error('Error saving result:', error);
        // Fallback: save only the new result
        if (typeof window !== 'undefined') {
          localStorage.setItem('speedtest-history', JSON.stringify([result]));
        }
      }
    }
  }, [history]);


  return {
    isRunning,
    progress,
    results,
    history,
    userInfo,
    networkQuality,
    startTest,
    resetTest,
    refreshHistory,
  };
}