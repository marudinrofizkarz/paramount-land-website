#!/usr/bin/env python3

import requests
import json

# Konfigurasi
API_BASE_URL = "http://localhost:9003"
COMPONENTS_ENDPOINT = f"{API_BASE_URL}/api/landing-pages/components"

# Data komponen yang akan ditambahkan
components_data = [
    {
        "name": "Custom Image Upload",
        "type": "custom-image",
        "config": {
            "desktopImage": "",
            "mobileImage": "",
            "alt": "Custom Image",
            "showCaption": True,
            "caption": "Gambar Properti Premium",
            "imagePosition": "center",
            "overlayText": "",
            "showOverlay": False,
            "overlayPosition": "center"
        },
        "preview_image": None,
        "is_system": True
    },
    {
        "name": "Copyright Notice",
        "type": "copyright",
        "config": {
            "text": "© 2024 Paramount Land. All rights reserved.",
            "showYear": True,
            "companyName": "Paramount Land",
            "additionalText": "Developed with ❤️ in Indonesia",
            "textAlign": "center",
            "backgroundColor": "#f8f9fa",
            "textColor": "#6c757d",
            "fontSize": "14",
            "showLogo": False,
            "logoUrl": ""
        },
        "preview_image": None,
        "is_system": True
    },
    {
        "name": "Footer Section",
        "type": "footer",
        "config": {
            "companyInfo": {
                "name": "Paramount Land",
                "description": "Developer properti terpercaya dengan pengalaman puluhan tahun.",
                "logo": "",
                "address": "Jl. TB Simatupang No. 1, Jakarta Selatan",
                "phone": "+62 21-1234-5678",
                "email": "info@paramountland.co.id"
            },
            "quickLinks": [
                {"title": "Home", "url": "/"},
                {"title": "Proyek", "url": "/projects"},
                {"title": "Tentang Kami", "url": "/about"},
                {"title": "Kontak", "url": "/contact"}
            ],
            "socialMedia": [
                {"platform": "facebook", "url": "https://facebook.com/paramountland"},
                {"platform": "instagram", "url": "https://instagram.com/paramountland"},
                {"platform": "youtube", "url": "https://youtube.com/paramountland"}
            ],
            "showNewsLetter": True,
            "backgroundColor": "#1a1a1a",
            "textColor": "#ffffff"
        },
        "preview_image": None,
        "is_system": True
    },
    {
        "name": "Fasilitas Properti",
        "type": "facilities",
        "config": {
            "title": "Fasilitas Lengkap",
            "subtitle": "Nikmati berbagai fasilitas premium untuk kenyamanan hidup Anda",
            "facilities": [
                {
                    "name": "Swimming Pool",
                    "description": "Kolam renang dengan pemandangan kota",
                    "icon": "pool"
                },
                {
                    "name": "Fitness Center", 
                    "description": "Gym dengan peralatan modern",
                    "icon": "fitness"
                },
                {
                    "name": "Security 24/7",
                    "description": "Keamanan terjamin sepanjang waktu",
                    "icon": "security"
                },
                {
                    "name": "Children Playground",
                    "description": "Area bermain anak yang aman",
                    "icon": "playground"
                }
            ],
            "layout": "grid",
            "columns": 2,
            "showIcons": True,
            "backgroundColor": "#ffffff",
            "cardColor": "#f8f9fa"
        },
        "preview_image": None,
        "is_system": True
    },
    {
        "name": "Unit Type Slider",
        "type": "unit-slider",
        "config": {
            "title": "Pilihan Tipe Unit",
            "subtitle": "Temukan unit yang sesuai dengan kebutuhan keluarga Anda",
            "units": [
                {
                    "name": "Studio Apartment",
                    "size": "25",
                    "bedroom": "0",
                    "bathroom": "1",
                    "price": "Rp 350.000.000",
                    "image": "/images/studio.jpg",
                    "features": ["Furnished", "City View", "Balcony"]
                },
                {
                    "name": "1 Bedroom",
                    "size": "35",
                    "bedroom": "1",
                    "bathroom": "1",
                    "price": "Rp 550.000.000",
                    "image": "/images/1br.jpg",
                    "features": ["Semi Furnished", "Garden View", "Balcony"]
                },
                {
                    "name": "2 Bedroom",
                    "size": "55",
                    "bedroom": "2",
                    "bathroom": "2",
                    "price": "Rp 850.000.000",
                    "image": "/images/2br.jpg",
                    "features": ["Furnished", "City View", "Balcony", "Study Room"]
                }
            ],
            "autoSlide": True,
            "slideInterval": 5000,
            "showPricing": True,
            "showFeatures": True
        },
        "preview_image": None,
        "is_system": True
    },
    {
        "name": "Progress Pembangunan",
        "type": "progress-slider",
        "config": {
            "title": "Progress Pembangunan",
            "subtitle": "Pantau perkembangan proyek secara real-time",
            "progressItems": [
                {
                    "title": "Tahap Persiapan",
                    "description": "Pembebasan lahan dan perizinan",
                    "date": "Q1 2024",
                    "percentage": 100,
                    "status": "completed",
                    "image": "/images/progress1.jpg"
                },
                {
                    "title": "Konstruksi Fondasi",
                    "description": "Pembangunan struktur bawah gedung",
                    "date": "Q2 2024",
                    "percentage": 85,
                    "status": "in-progress",
                    "image": "/images/progress2.jpg"
                },
                {
                    "title": "Konstruksi Bangunan",
                    "description": "Pembangunan struktur utama",
                    "date": "Q3 2024",
                    "percentage": 45,
                    "status": "in-progress",
                    "image": "/images/progress3.jpg"
                },
                {
                    "title": "Finishing & Serah Terima",
                    "description": "Penyelesaian dan handover unit",
                    "date": "Q4 2024",
                    "percentage": 0,
                    "status": "upcoming",
                    "image": "/images/progress4.jpg"
                }
            ],
            "autoSlide": True,
            "slideInterval": 6000,
            "showPercentage": True,
            "showStatus": True
        },
        "preview_image": None,
        "is_system": True
    },
    {
        "name": "Kerjasama Bank",
        "type": "bank-partnership",
        "config": {
            "title": "Kerjasama Bank",
            "subtitle": "Dapatkan kemudahan KPR dengan bunga kompetitif",
            "banks": [
                {
                    "name": "Bank BCA",
                    "logo": "/images/bca-logo.png",
                    "interestRate": "6.5%",
                    "maxTenor": "20 tahun",
                    "downPayment": "10%",
                    "features": ["Proses cepat", "Bunga tetap 2 tahun", "Tanpa biaya admin"]
                },
                {
                    "name": "Bank Mandiri",
                    "logo": "/images/mandiri-logo.png",
                    "interestRate": "6.8%",
                    "maxTenor": "25 tahun",
                    "downPayment": "5%",
                    "features": ["DP rendah", "Asuransi jiwa", "Cashback"]
                },
                {
                    "name": "Bank BRI",
                    "logo": "/images/bri-logo.png",
                    "interestRate": "7.0%",
                    "maxTenor": "20 tahun",
                    "downPayment": "15%",
                    "features": ["Bunga kompetitif", "Proses mudah", "Layanan prima"]
                }
            ],
            "showComparison": True,
            "ctaText": "Konsultasi KPR",
            "backgroundColor": "#f8f9fa"
        },
        "preview_image": None,
        "is_system": True
    },
    {
        "name": "Kontak Agent",
        "type": "agent-contact",
        "config": {
            "title": "Hubungi Sales Agent",
            "subtitle": "Tim sales berpengalaman siap membantu Anda",
            "agents": [
                {
                    "name": "Sarah Wijaya",
                    "position": "Senior Sales Executive",
                    "phone": "+62 812-3456-7890",
                    "email": "sarah@paramountland.co.id",
                    "whatsapp": "+62 812-3456-7890",
                    "photo": "/images/agent1.svg",
                    "experience": "8 tahun",
                    "specialization": "Apartemen & Townhouse"
                },
                {
                    "name": "David Chen",
                    "position": "Property Consultant",
                    "phone": "+62 813-4567-8901",
                    "email": "david@paramountland.co.id",
                    "whatsapp": "+62 813-4567-8901",
                    "photo": "/images/agent2.svg",
                    "experience": "5 tahun",
                    "specialization": "Landed House"
                }
            ],
            "showWhatsApp": True,
            "showEmail": True,
            "showPhone": True,
            "layout": "grid",
            "backgroundColor": "#ffffff"
        },
        "preview_image": None,
        "is_system": True
    },
    {
        "name": "Title & Description",
        "type": "title-description",
        "config": {
            "title": "Judul Bagian",
            "subtitle": "Subtitle yang menjelaskan lebih detail",
            "description": "Deskripsi lengkap yang memberikan informasi komprehensif tentang topik yang dibahas. Gunakan komponen ini untuk membuat pembagian konten yang jelas.",
            "titleSize": "large",
            "textAlign": "center",
            "showSubtitle": True,
            "showDescription": True,
            "titleColor": "#1a1a1a",
            "subtitleColor": "#6c757d",
            "descriptionColor": "#495057",
            "backgroundColor": "transparent",
            "maxWidth": "800px"
        },
        "preview_image": None,
        "is_system": True
    },
    {
        "name": "Akses Lokasi",
        "type": "location-access",
        "config": {
            "title": "Akses Lokasi Strategis",
            "subtitle": "Lokasi dengan akses mudah ke berbagai fasilitas kota",
            "mainLocation": {
                "name": "Paramount Land Residence",
                "address": "Jl. TB Simatupang No. 1, Jakarta Selatan",
                "coordinates": {
                    "lat": -6.2088,
                    "lng": 106.8456
                }
            },
            "accessPoints": [
                {
                    "category": "Transportasi",
                    "items": [
                        {"name": "Stasiun MRT Lebak Bulus", "distance": "500m", "time": "5 menit jalan kaki"},
                        {"name": "Halte TransJakarta", "distance": "300m", "time": "3 menit jalan kaki"},
                        {"name": "Tol Dalam Kota", "distance": "1km", "time": "5 menit berkendara"}
                    ]
                },
                {
                    "category": "Pendidikan",
                    "items": [
                        {"name": "Sekolah Dasar Favorit", "distance": "800m", "time": "10 menit jalan kaki"},
                        {"name": "SMP Internasional", "distance": "1.2km", "time": "5 menit berkendara"},
                        {"name": "Universitas Terkemuka", "distance": "3km", "time": "15 menit berkendara"}
                    ]
                }
            ],
            "nearbyPlaces": [
                {
                    "name": "Mall Pondok Indah",
                    "category": "Shopping",
                    "distance": "2km",
                    "time": "10 menit"
                },
                {
                    "name": "RS Pondok Indah",
                    "category": "Healthcare",
                    "distance": "1.5km",
                    "time": "8 menit"
                }
            ],
            "showMap": True,
            "mapHeight": "400px",
            "backgroundColor": "#f8f9fa"
        },
        "preview_image": None,
        "is_system": True
    },
    {
        "name": "Promo Special",
        "type": "promo",
        "config": {
            "title": "Promo Spesial Hari Ini!",
            "subtitle": "Jangan Lewatkan Kesempatan Emas",
            "description": "Dapatkan diskon fantastis untuk investasi properti impian Anda. Promo terbatas, buruan daftar sekarang!",
            "promoType": "discount",
            "discountValue": "30%",
            "originalPrice": "Rp 500.000.000",
            "discountedPrice": "Rp 350.000.000",
            "validUntil": "2024-12-31",
            "terms": [
                "Berlaku untuk pembelian unit tertentu",
                "Tidak dapat digabung dengan promo lain",
                "Syarat dan ketentuan berlaku"
            ],
            "ctaText": "Klaim Promo Sekarang",
            "ctaLink": "#contact",
            "backgroundColor": "#ff6b35",
            "textColor": "#ffffff",
            "accentColor": "#ffd700",
            "showTimer": True,
            "contactInfo": {
                "phone": "+62 812-3456-7890",
                "email": "promo@paramountland.co.id",
                "whatsapp": "+62 812-3456-7890"
            }
        },
        "preview_image": None,
        "is_system": True
    }
]

def add_component_to_db(component_data):
    """Menambahkan komponen ke database melalui API"""
    try:
        response = requests.post(
            COMPONENTS_ENDPOINT,
            json=component_data,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Berhasil menambahkan: {component_data['name']} (ID: {result.get('id', 'unknown')})")
            return True
        else:
            print(f"❌ Gagal menambahkan: {component_data['name']} - Status: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Error saat menambahkan {component_data['name']}: {e}")
        return False

def main():
    print("🚀 Menambahkan komponen template properti ke database...")
    print(f"🔗 API Endpoint: {COMPONENTS_ENDPOINT}")
    
    success_count = 0
    total_count = len(components_data)
    
    for component in components_data:
        print(f"\n📦 Menambahkan: {component['name']} (Type: {component['type']})")
        
        if add_component_to_db(component):
            success_count += 1
    
    print(f"\n🎉 Selesai! Berhasil menambahkan {success_count}/{total_count} komponen")
    
    if success_count < total_count:
        print("⚠️  Beberapa komponen gagal ditambahkan. Silakan cek error di atas.")

if __name__ == "__main__":
    main()
