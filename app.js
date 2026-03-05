document.addEventListener('DOMContentLoaded', () => {
    // 1. Logic สำหรับการกางคำตอบและสลับลูกศร ▲/▼
    const questions = document.querySelectorAll('.faq-question');
    questions.forEach(q => {
        q.addEventListener('click', () => {
            const answer = q.nextElementSibling;
            const icon = q.querySelector('.icon');
            
            if (answer.style.maxHeight && answer.style.maxHeight !== "0px") {
                answer.style.maxHeight = "0px";
                icon.textContent = '▼';
            } else {
                answer.style.maxHeight = answer.scrollHeight + "px";
                icon.textContent = '▲';
            }
        });
    });

    // 2. Logic สำหรับการกดปุ่มหมวดหมู่ (Filtering)
    const filterBtns = document.querySelectorAll('.filter-btn');
    const faqItems = document.querySelectorAll('.faq-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // สลับสถานะปุ่ม Active
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // แสดงเฉพาะหมวดที่เลือก
            const selectedCat = btn.getAttribute('data-cat');
            faqItems.forEach(item => {
                if (item.getAttribute('data-category') === selectedCat) {
                    item.style.display = "block";
                } else {
                    item.style.display = "none";
                    // ปิดคำตอบที่อาจค้างอยู่เมื่อสลับหมวด
                    const answer = item.querySelector('.faq-answer');
                    answer.style.maxHeight = "0px";
                    item.querySelector('.icon').textContent = '▼';
                }
            });
        });
    });
});
function initHeroSlider() {
    const slides = document.querySelectorAll('.slide');
    let current = 0;
    if (slides.length === 0) return;

    setInterval(() => {
        slides[current].classList.remove('active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('active');
    }, 4000); // สลับทุก 4 วินาที
}
window.addEventListener('load', initHeroSlider);
// --- JAVASCRIPT FOR BESTSELLER SLIDESHOW ---
const shopBtn = document.getElementById('start-slideshow');
const bestSellerContent = document.getElementById('best-seller-content');
const slideshowContainer = document.getElementById('fashion-slideshow');
const fashionSlides = document.querySelectorAll('.slide-item');

let slideIndex = 0;
let slideInterval;

if (shopBtn) {
    shopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // 1. เริ่มจางเนื้อหา Best Seller ออก
        bestSellerContent.style.transition = "opacity 0.6s ease";
        bestSellerContent.style.opacity = '0';
        
        setTimeout(() => {
            bestSellerContent.style.display = 'none';
            slideshowContainer.style.display = 'block';
            
            // รีเซ็ตทุกรูปให้จางก่อนเริ่ม
            fashionSlides.forEach(s => s.classList.remove('active'));
            slideIndex = 0;
            fashionSlides[0].classList.add('active'); // เริ่มที่รูปแรก
            
            startFashionSlides();
        }, 600);
    });
}

function startFashionSlides() {
    if(slideInterval) clearInterval(slideInterval);
    
    slideInterval = setInterval(() => {
        // จางรูปปัจจุบันออก
        fashionSlides[slideIndex].classList.remove('active');
        slideIndex++;

        // ถ้าเล่นครบ 11 รูป
        if (slideIndex >= fashionSlides.length) {
            clearInterval(slideInterval);
            // รอให้รูปสุดท้ายจางหายไปจนหมดก่อน (1.2s) แล้วค่อยเรียกหน้า Best Seller คืนมา
            setTimeout(backToBestSeller, 1500);
            return;
        }
        
        // แสดงรูปถัดไป
        fashionSlides[slideIndex].classList.add('active');
    }, 2800); // สลับรูปทุก 2.8 วินาที
}

function backToBestSeller() {
    slideshowContainer.style.display = 'none';
    bestSellerContent.style.display = 'flex'; // ใช้ flex เพื่อจัดกึ่งกลางเหมือนเดิม
    
    setTimeout(() => {
        bestSellerContent.style.opacity = '1';
        // เคลียร์ค่าทั้งหมดเพื่อให้กด Shop Now ใหม่ได้ทันที
        slideIndex = 0;
        fashionSlides.forEach(s => s.classList.remove('active'));
    }, 100);
}
// --- ส่วนการเชื่อมต่อฐานข้อมูลของคุณ Jarvis ---
// ใช้ Project ID: xuyjrpznobxbgjtggikk

// --- ส่วนการเชื่อมต่อฐานข้อมูลของคุณ Jarvis ---
// --- เริ่มวางทับตั้งแต่ตรงนี้เป็นต้นไปจนจบไฟล์ ---

// 1. เชื่อมต่อ Supabase (ใช้ URL และ Key เดิมของคุณ Jarvis)
const SUPABASE_URL = 'https://xuyjrpznobxbgjtggikk.supabase.co';
const SUPABASE_KEY = 'sb_publishable_qrQafd9Gy1AYCigofj6bxg_SuQcssp6';
const _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. ฟังก์ชันส่งข้อมูล (ที่แก้ชื่อ Attribute ให้ตรงกับหัวตารางตัวใหญ่แล้ว)
async function handleInquirySubmit(event) {
    event.preventDefault(); 
    
    const formData = {
        "Full_name": document.getElementById('fullName').value, // F ใหญ่
        "E-mail": document.getElementById('email').value, // E ใหญ่ + ขีดกลาง
        "Phone_number": document.getElementById('phone').value, // P ใหญ่
        "Subject": document.getElementById('subject').value, // S ใหญ่
        "Inquiry_type": document.getElementById('subject').value // ฝากค่าไว้ที่นี่ด้วย
    };

    const { data, error } = await _supabase
        .from('Inquiries') 
        .insert([formData]);

    if (error) {
        // ถ้าขึ้น error "new row violates row-level security policy"
        // ให้ไปกด "Add RLS policy" ในหน้า Supabase แล้วตั้งเป็น Enable Insert นะครับ
        alert('เกิดข้อผิดพลาด: ' + error.message);
    } else {
        alert('ส่งข้อมูลถึงคุณ Patcharaporn เรียบร้อยแล้ว!');
        event.target.reset(); 
    }
}
