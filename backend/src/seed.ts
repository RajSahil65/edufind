import { pool, initDB } from './db';

const colleges = [
  {
    name: 'IIT Bombay', location: 'Mumbai, Maharashtra', city: 'Mumbai', state: 'Maharashtra',
    type: 'IIT', established: 1958, rating: 4.8, total_reviews: 2340,
    annual_fees_min: 200000, annual_fees_max: 250000,
    placement_avg_package: 2200000, placement_highest_package: 12000000, placement_percentage: 97,
    total_seats: 1200, nirf_rank: 3,
    description: 'IIT Bombay is one of the premier engineering institutes in India, known for excellence in education and research. Located in the vibrant city of Mumbai, it offers world-class facilities and a diverse student community.',
    facilities: ['Library', 'Sports Complex', 'Research Labs', 'Hostel', 'Medical Center', 'Auditorium', 'Swimming Pool'],
    accreditation: 'NAAC A++',
    image_url: 'https://wallpaperaccess.com/full/8637671.jpg',
    website: 'https://www.iitb.ac.in'
  },
  {
    name: 'IIT Delhi', location: 'New Delhi, Delhi', city: 'New Delhi', state: 'Delhi',
    type: 'IIT', established: 1961, rating: 4.7, total_reviews: 2100,
    annual_fees_min: 200000, annual_fees_max: 250000,
    placement_avg_package: 2100000, placement_highest_package: 11000000, placement_percentage: 96,
    total_seats: 1100, nirf_rank: 2,
    description: 'IIT Delhi is situated in the heart of the national capital and is renowned for its cutting-edge research and strong industry connections. It has produced numerous entrepreneurs and leaders.',
    facilities: ['Central Library', 'Sports Center', 'Innovation Hub', 'Hostel', 'Hospital', 'Shopping Complex'],
    accreditation: 'NAAC A++',
    image_url: 'https://cdn.wallpapersafari.com/58/60/GgBt4a.png',
    website: 'https://home.iitd.ac.in'
  },
  {
    name: 'IIT Madras', location: 'Chennai, Tamil Nadu', city: 'Chennai', state: 'Tamil Nadu',
    type: 'IIT', established: 1959, rating: 4.9, total_reviews: 1980,
    annual_fees_min: 200000, annual_fees_max: 250000,
    placement_avg_package: 2300000, placement_highest_package: 13500000, placement_percentage: 98,
    total_seats: 1000, nirf_rank: 1,
    description: 'Ranked #1 in India by NIRF, IIT Madras is a pioneer in research and innovation. Set in a lush green campus, it offers an unparalleled academic experience with over 50 years of excellence.',
    facilities: ['Research Parks', 'Stadium', 'Forest Campus', 'Hostel', 'Health Center', 'Clubs'],
    accreditation: 'NAAC A++',
    image_url: 'https://wallpaperaccess.com/full/9564941.jpg',
    website: 'https://www.iitm.ac.in'
  },
  {
    name: 'IIT Kanpur', location: 'Kanpur, Uttar Pradesh', city: 'Kanpur', state: 'Uttar Pradesh',
    type: 'IIT', established: 1959, rating: 4.7, total_reviews: 1750,
    annual_fees_min: 200000, annual_fees_max: 250000,
    placement_avg_package: 2000000, placement_highest_package: 10000000, placement_percentage: 95,
    total_seats: 900, nirf_rank: 4,
    description: 'IIT Kanpur is known for its liberal arts approach to engineering education. It was the first IIT to offer computer science programs in India.',
    facilities: ['Library', 'Aircraft Hangar', 'Sports', 'Hostel', 'Medical', 'Gliding Club'],
    accreditation: 'NAAC A++',
    image_url: 'https://image-static.collegedunia.com/public/college_data/images/campusimage/25948_Campus_infra7.webp',
    website: 'https://www.iitk.ac.in'
  },
  {
    name: 'IIT Kharagpur', location: 'Kharagpur, West Bengal', city: 'Kharagpur', state: 'West Bengal',
    type: 'IIT', established: 1951, rating: 4.6, total_reviews: 2200,
    annual_fees_min: 180000, annual_fees_max: 230000,
    placement_avg_package: 1900000, placement_highest_package: 9500000, placement_percentage: 94,
    total_seats: 2300, nirf_rank: 5,
    description: 'The oldest IIT in India, IIT Kharagpur has the largest campus among all IITs. It is known for its diverse programs and strong alumni network.',
    facilities: ['Lake', 'Stadium', 'Technology Park', 'Hospital', 'Schools', 'Market'],
    accreditation: 'NAAC A++',
    image_url: 'https://assets.collegedunia.com/public/image/Screenshot_2025_04_11_115611_45a60f7b3cccbed243909a9af65de012.png',
    website: 'https://www.iitkgp.ac.in'
  },
  {
    name: 'NIT Trichy', location: 'Tiruchirappalli, Tamil Nadu', city: 'Tiruchirappalli', state: 'Tamil Nadu',
    type: 'NIT', established: 1964, rating: 4.5, total_reviews: 1560,
    annual_fees_min: 150000, annual_fees_max: 180000,
    placement_avg_package: 1200000, placement_highest_package: 7000000, placement_percentage: 92,
    total_seats: 1800, nirf_rank: 9,
    description: 'NIT Trichy is consistently ranked as the top NIT in India. Known for its strong engineering programs and excellent placement record.',
    facilities: ['Library', 'Sports Complex', 'Labs', 'Hostel', 'Medical', 'Auditorium'],
    accreditation: 'NAAC A',
    image_url: 'https://wallpaperaccess.com/full/16285003.jpg',
    website: 'https://www.nitt.edu'
  },
  {
    name: 'NIT Warangal', location: 'Warangal, Telangana', city: 'Warangal', state: 'Telangana',
    type: 'NIT', established: 1959, rating: 4.4, total_reviews: 1340,
    annual_fees_min: 145000, annual_fees_max: 175000,
    placement_avg_package: 1100000, placement_highest_package: 6500000, placement_percentage: 90,
    total_seats: 1700, nirf_rank: 12,
    description: 'One of the oldest NITs, NIT Warangal is known for its strong technical programs and active student community.',
    facilities: ['Library', 'Sports', 'Labs', 'Hostel', 'Cafeteria', 'Bank'],
    accreditation: 'NAAC A',
    image_url: 'https://blogcdn.aakash.ac.in/wordpress_media/2024/07/NIT-Warangal.jpg',
    website: 'https://www.nitw.ac.in'
  },
  {
    name: 'BITS Pilani', location: 'Pilani, Rajasthan', city: 'Pilani', state: 'Rajasthan',
    type: 'Deemed', established: 1964, rating: 4.6, total_reviews: 1890,
    annual_fees_min: 450000, annual_fees_max: 550000,
    placement_avg_package: 1800000, placement_highest_package: 9000000, placement_percentage: 95,
    total_seats: 3500, nirf_rank: 25,
    description: 'BITS Pilani is one of the most prestigious private engineering institutes in India, known for its unique dual-degree programs and practice school.',
    facilities: ['Library', 'Sports Complex', 'Labs', 'Hostels', 'Hospital', 'Clubs'],
    accreditation: 'NAAC A',
    image_url: 'https://images.indianexpress.com/2025/05/BITS-Pilani.jpg?w=270',
    website: 'https://www.bits-pilani.ac.in'
  },
  {
    name: 'VIT Vellore', location: 'Vellore, Tamil Nadu', city: 'Vellore', state: 'Tamil Nadu',
    type: 'Deemed', established: 1984, rating: 4.2, total_reviews: 3200,
    annual_fees_min: 190000, annual_fees_max: 240000,
    placement_avg_package: 700000, placement_highest_package: 4000000, placement_percentage: 82,
    total_seats: 8000, nirf_rank: 11,
    description: 'VIT Vellore is one of the largest private universities in India, known for its international collaborations and strong industry connections.',
    facilities: ['Library', 'Swimming Pool', 'Football Ground', 'Hostel', 'Food Court', 'Tech Park'],
    accreditation: 'NAAC A++',
    image_url: 'https://cdn1.byjus.com/wp-content/uploads/2018/11/jee/2016/08/01101548/VIT.png',
    website: 'https://vit.ac.in'
  },
  {
    name: 'SRM Institute of Science and Technology', location: 'Chennai, Tamil Nadu', city: 'Chennai', state: 'Tamil Nadu',
    type: 'Deemed', established: 1985, rating: 4.0, total_reviews: 2800,
    annual_fees_min: 220000, annual_fees_max: 280000,
    placement_avg_package: 600000, placement_highest_package: 3500000, placement_percentage: 78,
    total_seats: 10000, nirf_rank: 36,
    description: 'SRM is one of India\'s top-ranked universities with strong research output and global industry partnerships.',
    facilities: ['Library', 'Sports', 'Labs', 'Hostel', 'Hospital', 'Incubation Center'],
    accreditation: 'NAAC A++',
    image_url: 'https://image-static.collegedunia.com/public/reviewPhotos/1139435/7.jpg',
    website: 'https://www.srmist.edu.in'
  },
  {
    name: 'Manipal Institute of Technology', location: 'Manipal, Karnataka', city: 'Manipal', state: 'Karnataka',
    type: 'Deemed', established: 1957, rating: 4.3, total_reviews: 2100,
    annual_fees_min: 350000, annual_fees_max: 420000,
    placement_avg_package: 900000, placement_highest_package: 5000000, placement_percentage: 85,
    total_seats: 6000, nirf_rank: 41,
    description: 'MIT Manipal is a premier private institute known for its innovative curriculum and strong international exposure.',
    facilities: ['Library', 'Beach', 'Sports', 'Hostel', 'Hospital', 'Shopping Mall'],
    accreditation: 'NAAC A+',
    image_url: 'https://image-static.collegedunia.com/public/college_data/images/campusimage/14265_infrastructure1.webp',
    website: 'https://manipal.edu/mit.html'
  },
  {
    name: 'Delhi Technological University', location: 'New Delhi, Delhi', city: 'New Delhi', state: 'Delhi',
    type: 'Government', established: 1941, rating: 4.1, total_reviews: 1700,
    annual_fees_min: 80000, annual_fees_max: 120000,
    placement_avg_package: 900000, placement_highest_package: 5500000, placement_percentage: 88,
    total_seats: 2000, nirf_rank: 34,
    description: 'DTU (formerly DCE) is one of the oldest engineering colleges in Delhi, known for affordable quality education and strong industry ties.',
    facilities: ['Library', 'Sports Ground', 'Labs', 'Hostel', 'Medical', 'Canteen'],
    accreditation: 'NAAC A',
    image_url: 'https://media.collegedekho.com/media/img/institute/crawled_images/dl2.jpg?width=640',
    website: 'https://dtu.ac.in'
  },
  {
    name: 'IIIT Hyderabad', location: 'Hyderabad, Telangana', city: 'Hyderabad', state: 'Telangana',
    type: 'IIIT', established: 1998, rating: 4.5, total_reviews: 980,
    annual_fees_min: 320000, annual_fees_max: 380000,
    placement_avg_package: 1600000, placement_highest_package: 8000000, placement_percentage: 96,
    total_seats: 600, nirf_rank: 21,
    description: 'IIIT Hyderabad is a research-oriented institute specializing in computer science and IT. Known for its entrepreneurship culture.',
    facilities: ['Research Labs', 'Library', 'Sports', 'Hostel', 'Incubation Center'],
    accreditation: 'NAAC A',
    image_url: 'https://image-static.collegedunia.com/public/college_data/images/campusimage/150882889710985913_590866930949776_3787999885488180564_n.jpg',
    website: 'https://www.iiit.ac.in'
  },
  {
    name: 'Thapar Institute of Engineering', location: 'Patiala, Punjab', city: 'Patiala', state: 'Punjab',
    type: 'Deemed', established: 1956, rating: 4.1, total_reviews: 1200,
    annual_fees_min: 270000, annual_fees_max: 310000,
    placement_avg_package: 800000, placement_highest_package: 4500000, placement_percentage: 83,
    total_seats: 3000, nirf_rank: 50,
    description: 'Thapar is a well-regarded private university known for its strong CSE and ECE programs.',
    facilities: ['Library', 'Sports Complex', 'Labs', 'Hostel', 'Canteen', 'Bank'],
    accreditation: 'NAAC A',
    image_url: 'https://media-cdn.tripadvisor.com/media/photo-o/09/5b/9d/fd/thapar-university.jpg',
    website: 'https://www.thapar.edu'
  },
  {
    name: 'PSG College of Technology', location: 'Coimbatore, Tamil Nadu', city: 'Coimbatore', state: 'Tamil Nadu',
    type: 'Private', established: 1951, rating: 4.0, total_reviews: 890,
    annual_fees_min: 90000, annual_fees_max: 130000,
    placement_avg_package: 650000, placement_highest_package: 3000000, placement_percentage: 80,
    total_seats: 3500, nirf_rank: 68,
    description: 'PSG Tech is one of the most reputed private colleges in South India, known for quality education at affordable fees.',
    facilities: ['Library', 'Sports', 'Labs', 'Hostel', 'Medical', 'Bank'],
    accreditation: 'NAAC A+',
    image_url: 'https://d13loartjoc1yn.cloudfront.net/upload/institute/images/large/Screenshot%20(46).webp',
    website: 'https://www.psgtech.edu'
  },
  {
    name: 'IIT Roorkee', location: 'Roorkee, Uttarakhand', city: 'Roorkee', state: 'Uttarakhand',
    type: 'IIT', established: 1847, rating: 4.6, total_reviews: 1650,
    annual_fees_min: 200000, annual_fees_max: 250000,
    placement_avg_package: 1850000, placement_highest_package: 9000000, placement_percentage: 94,
    total_seats: 1800, nirf_rank: 7,
    description: 'The oldest technical institute in Asia, IIT Roorkee combines heritage with modern excellence. Known for civil and earthquake engineering.',
    facilities: ['Heritage Campus', 'Library', 'Sports', 'Hostel', 'Hospital', 'Botanical Garden'],
    accreditation: 'NAAC A++',
    image_url: 'https://wallpapercave.com/wp/wp11440163.jpg',
    website: 'https://www.iitr.ac.in'
  },
  {
    name: 'Jadavpur University', location: 'Kolkata, West Bengal', city: 'Kolkata', state: 'West Bengal',
    type: 'Government', established: 1955, rating: 4.4, total_reviews: 1420,
    annual_fees_min: 25000, annual_fees_max: 50000,
    placement_avg_package: 850000, placement_highest_package: 5000000, placement_percentage: 87,
    total_seats: 4000, nirf_rank: 15,
    description: 'Jadavpur University is one of the most prestigious government universities offering world-class education at extremely affordable fees.',
    facilities: ['Library', 'Sports', 'Labs', 'Hostel', 'Cafeteria', 'Cultural Center'],
    accreditation: 'NAAC A++',
    image_url: 'https://www.collegebatch.com/static/clg-gallery/jadavpur-university-kolkata-214594.webp',
    website: 'https://jadavpuruniversity.in'
  },
  {
    name: 'NIT Surathkal', location: 'Mangaluru, Karnataka', city: 'Mangaluru', state: 'Karnataka',
    type: 'NIT', established: 1960, rating: 4.3, total_reviews: 1100,
    annual_fees_min: 145000, annual_fees_max: 175000,
    placement_avg_package: 1050000, placement_highest_package: 6000000, placement_percentage: 89,
    total_seats: 1500, nirf_rank: 18,
    description: 'NIT Surathkal is known for its scenic beachside campus and strong programs in computer science and electronics.',
    facilities: ['Beach', 'Library', 'Sports', 'Hostel', 'Medical', 'Cafeteria'],
    accreditation: 'NAAC A',
    image_url: 'https://www.collegebatch.com/static/clg-gallery/national-institute-of-technology-karnataka-surathkal-238098.jpg',
    website: 'https://www.nitk.ac.in'
  },
  {
    name: 'Anna University', location: 'Chennai, Tamil Nadu', city: 'Chennai', state: 'Tamil Nadu',
    type: 'Government', established: 1978, rating: 4.2, total_reviews: 2300,
    annual_fees_min: 60000, annual_fees_max: 100000,
    placement_avg_package: 700000, placement_highest_package: 4000000, placement_percentage: 82,
    total_seats: 5000, nirf_rank: 22,
    description: 'Anna University is one of the largest technical universities in India, offering affiliated programs across Tamil Nadu.',
    facilities: ['Library', 'Sports Complex', 'Labs', 'Hostel', 'Hospital', 'Convention Center'],
    accreditation: 'NAAC A++',
    image_url: 'https://img-cdn.publive.online/fit-in/580x348/filters:format(webp)/indian-express-tamil/media/media_files/2024/12/25/Q8J6mtwpnrVYNecnezjE.jpg',
    website: 'https://www.annauniv.edu'
  },
  {
    name: 'IIM Ahmedabad', location: 'Ahmedabad, Gujarat', city: 'Ahmedabad', state: 'Gujarat',
    type: 'IIM', established: 1961, rating: 4.9, total_reviews: 1200,
    annual_fees_min: 2300000, annual_fees_max: 2500000,
    placement_avg_package: 3200000, placement_highest_package: 10000000, placement_percentage: 100,
    total_seats: 400, nirf_rank: 1,
    description: 'IIM Ahmedabad is the top management institute in India and consistently ranks among the best business schools in Asia.',
    facilities: ['Case Study Rooms', 'Library', 'Sports', 'Hostel', 'Cafeteria', 'Amphitheatre'],
    accreditation: 'AACSB, EQUIS',
    image_url: 'https://www.learningroutes.in/_next/image?url=https://storage.googleapis.com/web_cms_content/banner_3ddadc6b8b/banner_3ddadc6b8b.webp&w=3840&q=75',
    website: 'https://www.iima.ac.in'
  },
  {
    name: 'IIM Bangalore', location: 'Bengaluru, Karnataka', city: 'Bengaluru', state: 'Karnataka',
    type: 'IIM', established: 1973, rating: 4.8, total_reviews: 1050,
    annual_fees_min: 2400000, annual_fees_max: 2600000,
    placement_avg_package: 3100000, placement_highest_package: 9500000, placement_percentage: 100,
    total_seats: 420, nirf_rank: 2,
    description: 'IIM Bangalore, located in India\'s Silicon Valley, is known for its entrepreneurship culture and strong tech industry connections.',
    facilities: ['Case Rooms', 'Library', 'Sports', 'Hostel', 'Incubation Center', 'Amphitheatre'],
    accreditation: 'AACSB, EQUIS',
    image_url: 'https://images.indianexpress.com/2026/04/IIM-Bangalore.jpg?w=1600',
    website: 'https://www.iimb.ac.in'
  },
  {
    name: 'COEP Technological University', location: 'Pune, Maharashtra', city: 'Pune', state: 'Maharashtra',
    type: 'Government', established: 1854, rating: 4.1, total_reviews: 980,
    annual_fees_min: 65000, annual_fees_max: 95000,
    placement_avg_package: 750000, placement_highest_package: 4200000, placement_percentage: 86,
    total_seats: 2400, nirf_rank: 42,
    description: 'COEP is one of the oldest engineering colleges in Asia, recently elevated to university status. Known for strong alumni base in Pune\'s industry.',
    facilities: ['Library', 'Sports', 'Labs', 'Hostel', 'Medical', 'E-Cell'],
    accreditation: 'NAAC A',
    image_url: 'https://content.jdmagicbox.com/comp/pune/07/020p5024207/catalogue/college-of-engineering-pune-shivaji-nagar-pune-colleges-2jgrxiy.jpg?w=3840&q=75',
    website: 'https://www.coeptech.ac.in'
  },
  {
    name: 'PES University', location: 'Bengaluru, Karnataka', city: 'Bengaluru', state: 'Karnataka',
    type: 'Deemed', established: 1988, rating: 4.0, total_reviews: 1350,
    annual_fees_min: 200000, annual_fees_max: 270000,
    placement_avg_package: 800000, placement_highest_package: 4500000, placement_percentage: 84,
    total_seats: 5000, nirf_rank: 62,
    description: 'PES University is a top private university in Bangalore with excellent placement records especially in IT and software.',
    facilities: ['Library', 'Sports', 'Labs', 'Hostel', 'Cafeteria', 'Innovation Center'],
    accreditation: 'NAAC A',
    image_url: 'https://i.pinimg.com/originals/ac/ec/76/acec76ba954e8056dbcbb88f821231dd.jpg',
    website: 'https://pes.edu'
  },
  {
    name: 'Amrita Vishwa Vidyapeetham', location: 'Coimbatore, Tamil Nadu', city: 'Coimbatore', state: 'Tamil Nadu',
    type: 'Deemed', established: 1994, rating: 4.0, total_reviews: 1600,
    annual_fees_min: 175000, annual_fees_max: 220000,
    placement_avg_package: 650000, placement_highest_package: 3800000, placement_percentage: 80,
    total_seats: 8000, nirf_rank: 7,
    description: 'Amrita is consistently ranked among India\'s top 10 universities. Known for research, innovation, and value-based education.',
    facilities: ['Library', 'Sports', 'Research Centers', 'Hostel', 'Hospital', 'Meditation Hall'],
    accreditation: 'NAAC A++',
    image_url: 'https://image-static.collegedunia.com/public/college_data/images/campusimage/1407152952cmpus_home_five.jpg',
    website: 'https://www.amrita.edu'
  },
  {
    name: 'NIT Calicut', location: 'Kozhikode, Kerala', city: 'Kozhikode', state: 'Kerala',
    type: 'NIT', established: 1961, rating: 4.3, total_reviews: 1050,
    annual_fees_min: 148000, annual_fees_max: 178000,
    placement_avg_package: 1000000, placement_highest_package: 5800000, placement_percentage: 88,
    total_seats: 1400, nirf_rank: 20,
    description: 'NIT Calicut is set in the beautiful Calicut hills and known for its strong engineering programs and research.',
    facilities: ['Library', 'Sports', 'Labs', 'Hostel', 'Medical', 'Co-operative Bank'],
    accreditation: 'NAAC A',
    image_url: 'https://i.pinimg.com/originals/35/e4/2a/35e42ac955d028e80e8c3dae741bc437.jpg',
    website: 'https://www.nitc.ac.in'
  },
  {
    name: 'Nirma University', location: 'Ahmedabad, Gujarat', city: 'Ahmedabad', state: 'Gujarat',
    type: 'Deemed', established: 1994, rating: 3.9, total_reviews: 870,
    annual_fees_min: 210000, annual_fees_max: 260000,
    placement_avg_package: 700000, placement_highest_package: 3500000, placement_percentage: 81,
    total_seats: 4000, nirf_rank: 72,
    description: 'Nirma University offers quality engineering and management education in the heart of Ahmedabad.',
    facilities: ['Library', 'Sports', 'Labs', 'Hostel', 'Medical', 'Auditorium'],
    accreditation: 'NAAC A',
    image_url: 'https://image-static.collegedunia.com/public/college_data/images/campusimage/28275_Campus%20(4).webp',
    website: 'https://nirmauni.ac.in'
  },
  {
    name: 'NSIT Delhi', location: 'New Delhi, Delhi', city: 'New Delhi', state: 'Delhi',
    type: 'Government', established: 1983, rating: 4.0, total_reviews: 780,
    annual_fees_min: 55000, annual_fees_max: 85000,
    placement_avg_package: 850000, placement_highest_package: 5000000, placement_percentage: 86,
    total_seats: 1200, nirf_rank: 45,
    description: 'NSIT (Netaji Subhas University of Technology) is a premier government institution in Delhi offering quality education at subsidized fees.',
    facilities: ['Library', 'Sports', 'Labs', 'Medical', 'Cafeteria', 'Bank'],
    accreditation: 'NAAC A',
    image_url: 'https://image-static.collegedunia.com/public/image/1_0886062e374068cf74a1c1523df4f8e2.png',
    website: 'https://www.nsut.ac.in'
  },
  {
    name: 'Symbiosis Institute of Technology', location: 'Pune, Maharashtra', city: 'Pune', state: 'Maharashtra',
    type: 'Deemed', established: 2008, rating: 3.8, total_reviews: 650,
    annual_fees_min: 350000, annual_fees_max: 420000,
    placement_avg_package: 700000, placement_highest_package: 3200000, placement_percentage: 78,
    total_seats: 1800, nirf_rank: 98,
    description: 'SIT Pune is part of the prestigious Symbiosis International University, offering modern infrastructure and industry-integrated curriculum.',
    facilities: ['Library', 'Sports', 'Labs', 'Hostel', 'Medical', 'E-Cell'],
    accreditation: 'NAAC A',
    image_url: 'https://www.mbacollegespune.in/wp-content/uploads/2017/09/symbiosis-internationaluniversity.jpg',
    website: 'https://www.sitpune.edu.in'
  },
  {
    name: 'IIT Hyderabad', location: 'Hyderabad, Telangana', city: 'Hyderabad', state: 'Telangana',
    type: 'IIT', established: 2008, rating: 4.3, total_reviews: 760,
    annual_fees_min: 200000, annual_fees_max: 250000,
    placement_avg_package: 1500000, placement_highest_package: 7500000, placement_percentage: 92,
    total_seats: 800, nirf_rank: 8,
    description: 'IIT Hyderabad is a newer IIT that has quickly established itself as a research powerhouse with strong industry collaboration.',
    facilities: ['Modern Labs', 'Library', 'Sports', 'Hostel', 'Medical', 'Incubation Center'],
    accreditation: 'NAAC A',
    image_url: 'https://www.iitsystem.ac.in/themes/bfd/assets/image/slider/iit-hyderabad.jpg',
    website: 'https://iith.ac.in'
  },
  {
    name: 'Chandigarh University', location: 'Chandigarh, Punjab', city: 'Chandigarh', state: 'Punjab',
    type: 'Deemed', established: 2012, rating: 3.9, total_reviews: 2100,
    annual_fees_min: 155000, annual_fees_max: 210000,
    placement_avg_package: 600000, placement_highest_package: 3000000, placement_percentage: 80,
    total_seats: 15000, nirf_rank: 28,
    description: 'Chandigarh University is among the fastest growing universities in India, known for its large scale placements and international programs.',
    facilities: ['Library', 'Sports Complex', 'Labs', 'Hostel', 'Hospital', 'Innovation Center'],
    accreditation: 'NAAC A+',
    image_url: 'https://eduvow.com/images/college/429_cu.jpg',
    website: 'https://www.cuchd.in'
  },
  {
    name: 'COER University', location: 'Roorkee, Uttarakhand', city: 'Roorkee', state: 'Uttarakhand',
    type: 'Private', established:1998, rating: 3.9, total_reviews: 2100,
    annual_fees_min: 190000, annual_fees_max: 210000,
    placement_avg_package: 600000, placement_highest_package: 3000000, placement_percentage: 95,
    total_seats: 1500, nirf_rank: 298,
    description: 'Coer University is the best private university in uttarakhand.',
    facilities: ['Library', 'Sports Complex', 'Labs', 'Hostel', 'Hospital', 'Innovation Center'],
    accreditation: 'UGC',
    image_url: 'https://edufever.in/colleges/wp-content/uploads/2024/11/COER-University.webp',
    website: 'https://coeruniversity.ac.in/'
  }
];

const courses = [
  { name: 'Computer Science Engineering', degree: 'B.Tech', duration: 4, fees_multiplier: 1.0, exam: 'JEE Main' },
  { name: 'Electronics & Communication Engineering', degree: 'B.Tech', duration: 4, fees_multiplier: 0.95, exam: 'JEE Main' },
  { name: 'Mechanical Engineering', degree: 'B.Tech', duration: 4, fees_multiplier: 0.9, exam: 'JEE Main' },
  { name: 'Civil Engineering', degree: 'B.Tech', duration: 4, fees_multiplier: 0.85, exam: 'JEE Main' },
  { name: 'Electrical Engineering', degree: 'B.Tech', duration: 4, fees_multiplier: 0.92, exam: 'JEE Main' },
  { name: 'Information Technology', degree: 'B.Tech', duration: 4, fees_multiplier: 0.98, exam: 'JEE Main' },
  { name: 'Data Science & AI', degree: 'B.Tech', duration: 4, fees_multiplier: 1.05, exam: 'JEE Main' },
  { name: 'Computer Science (M.Tech)', degree: 'M.Tech', duration: 2, fees_multiplier: 0.8, exam: 'GATE' },
  { name: 'MBA (General Management)', degree: 'MBA', duration: 2, fees_multiplier: 2.0, exam: 'CAT' },
];

const reviewTemplates = [
  { title: 'Excellent academic environment', content: 'The quality of education here is top-notch. Professors are highly qualified and research opportunities are abundant. The campus life is vibrant and there are plenty of extracurricular activities.', rating: 5 },
  { title: 'Great placements, decent campus life', content: 'The placement cell is very active and helps students land good jobs. The campus infrastructure is good with all necessary facilities. Food could be better in the hostel mess.', rating: 4 },
  { title: 'Good college with some room for improvement', content: 'Overall a good experience. The faculty is knowledgeable but sometimes syllabus feels outdated. Industry exposure through internships is good. Alumni network is helpful.', rating: 3 },
  { title: 'Outstanding research facilities', content: 'The labs and research facilities are world-class. Many students go for higher studies abroad from here. The peer group quality is excellent which pushes you to perform better.', rating: 5 },
  { title: 'Average experience', content: 'The college has good brand value but the actual learning experience could be better. Too much focus on exams rather than practical skills. However the campus events are fun.', rating: 3 },
];

const reviewers = ['Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Ananya Singh', 'Rajesh Verma', 'Sneha Reddy', 'Arjun Nair', 'Kavya Menon', 'Vikas Gupta', 'Pooja Agarwal'];

async function seed() {
  console.log('Starting seed...');
  
  const client = await pool.connect();
  
  try {
    // Clear existing data
    await client.query('DELETE FROM predictor_data');
    await client.query('DELETE FROM reviews');
    await client.query('DELETE FROM courses');
    await client.query('DELETE FROM colleges');
    
    console.log('Cleared existing data');

    // Insert colleges
    const collegeIds: { [key: string]: string } = {};
    
    for (const college of colleges) {
      const result = await client.query(
        `INSERT INTO colleges (name, location, city, state, type, established, rating, total_reviews, 
         annual_fees_min, annual_fees_max, placement_avg_package, placement_highest_package, 
         placement_percentage, total_seats, nirf_rank, website, image_url, description, 
         facilities, accreditation)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
         RETURNING id`,
        [
          college.name, college.location, college.city, college.state, college.type,
          college.established, college.rating, college.total_reviews,
          college.annual_fees_min, college.annual_fees_max,
          college.placement_avg_package, college.placement_highest_package,
          college.placement_percentage, college.total_seats, college.nirf_rank,
          college.website, college.image_url, college.description,
          college.facilities, college.accreditation
        ]
      );
      collegeIds[college.name] = result.rows[0].id;
    }
    
    console.log(`Inserted ${colleges.length} colleges`);

    // Insert courses for each college
    let courseCount = 0;
    const courseIds: string[] = [];
    
    for (const [collegeName, collegeId] of Object.entries(collegeIds)) {
      const college = colleges.find(c => c.name === collegeName)!;
      const numCourses = Math.floor(Math.random() * 4) + 3; // 3-6 courses per college
      const selectedCourses = courses.sort(() => 0.5 - Math.random()).slice(0, numCourses);
      
      for (const course of selectedCourses) {
        const fees = Math.round((college.annual_fees_min + college.annual_fees_max) / 2 * course.fees_multiplier);
        const result = await client.query(
          `INSERT INTO courses (college_id, name, degree, duration, annual_fees, total_seats, exam_accepted, cutoff_general, cutoff_obc, cutoff_sc)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`,
          [
            collegeId, course.name, course.degree, course.duration, fees,
            Math.floor(Math.random() * 200) + 60,
            [course.exam, 'State CET'],
            Math.floor(Math.random() * 50000) + 1000,
            Math.floor(Math.random() * 100000) + 50000,
            Math.floor(Math.random() * 200000) + 100000
          ]
        );
        courseIds.push(result.rows[0].id);
        courseCount++;
      }
    }
    
    console.log(`Inserted ${courseCount} courses`);

    // Insert reviews
    let reviewCount = 0;
    for (const [collegeName, collegeId] of Object.entries(collegeIds)) {
      const college = colleges.find(c => c.name === collegeName)!;
      const numReviews = Math.floor(college.total_reviews / 400) + 2; // proportional
      
      for (let i = 0; i < numReviews; i++) {
        const template = reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)];
        const reviewer = reviewers[Math.floor(Math.random() * reviewers.length)];
        await client.query(
          `INSERT INTO reviews (college_id, reviewer_name, batch_year, rating, title, content, infrastructure_rating, faculty_rating, placement_rating)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
          [
            collegeId, reviewer, 2020 + Math.floor(Math.random() * 4), template.rating,
            template.title, template.content,
            Math.floor(Math.random() * 2) + 3, Math.floor(Math.random() * 2) + 3, Math.floor(Math.random() * 2) + 3
          ]
        );
        reviewCount++;
      }
    }
    
    console.log(`Inserted ${reviewCount} reviews`);

    // Insert predictor data
    const examRankRanges: { [key: string]: { type: string[], rank_ranges: [number, number][] } } = {
      'IIT': { type: ['JEE Advanced'], rank_ranges: [[1, 500], [500, 1500], [1500, 5000], [5000, 10000]] },
      'NIT': { type: ['JEE Main'], rank_ranges: [[1, 2000], [2000, 8000], [8000, 25000], [25000, 75000], [75000, 200000]] },
      'IIIT': { type: ['JEE Main'], rank_ranges: [[1, 3000], [3000, 10000], [10000, 30000], [30000, 100000], [100000, 300000]] },
      'Deemed': { type: ['JEE Main', 'State CET'], rank_ranges: [[1, 5000], [5000, 50000], [50000, 200000], [200000, 600000], [600000, 1500000]] },
      'Government': { type: ['JEE Main', 'State CET'], rank_ranges: [[1, 5000], [5000, 30000], [30000, 100000], [100000, 400000], [400000, 1000000]] },
      'IIM': { type: ['CAT'], rank_ranges: [[1, 500], [500, 1500], [1500, 3000], [3000, 5000]] },
      'Private': { type: ['JEE Main', 'State CET'], rank_ranges: [[1, 10000], [10000, 80000], [80000, 300000], [300000, 800000], [800000, 2000000]] },
    };

    let predictorCount = 0;
    for (const [collegeName, collegeId] of Object.entries(collegeIds)) {
      const college = colleges.find(c => c.name === collegeName)!;
      const examInfo = examRankRanges[college.type];
      if (!examInfo) continue;

     for (const exam of examInfo.type) {
      for (const [min, max] of examInfo.rank_ranges) {
        await client.query(
          `INSERT INTO predictor_data (college_id, exam, category, rank_min, rank_max, year) VALUES ($1,$2,$3,$4,$5,$6)`,
          [collegeId, exam, 'General', min, max, 2024]
        );
        await client.query(
          `INSERT INTO predictor_data (college_id, exam, category, rank_min, rank_max, year) VALUES ($1,$2,$3,$4,$5,$6)`,
          [collegeId, exam, 'OBC', Math.round(min * 1.5), Math.round(max * 1.5), 2024]
        );
        await client.query(
          `INSERT INTO predictor_data (college_id, exam, category, rank_min, rank_max, year) VALUES ($1,$2,$3,$4,$5,$6)`,
          [collegeId, exam, 'SC', Math.round(min * 3), Math.round(max * 3), 2024]
        );
        await client.query(
          `INSERT INTO predictor_data (college_id, exam, category, rank_min, rank_max, year) VALUES ($1,$2,$3,$4,$5,$6)`,
          [collegeId, exam, 'ST', Math.round(min * 4), Math.round(max * 4), 2024]
        );
        await client.query(
          `INSERT INTO predictor_data (college_id, exam, category, rank_min, rank_max, year) VALUES ($1,$2,$3,$4,$5,$6)`,
          [collegeId, exam, 'EWS', Math.round(min * 1.2), Math.round(max * 1.2), 2024]
        );
        predictorCount += 5;
      }
    }
    }
    
    console.log(`Inserted ${predictorCount} predictor records`);
    console.log('Seed completed successfully!');
    
  } catch (err) {
    console.error(' Seed failed:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}


export { seed };
if (require.main === module) {
  initDB().then(() => seed()).catch(console.error);
}