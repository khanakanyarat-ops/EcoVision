document.addEventListener("DOMContentLoaded", function () {

    // ==========================================================================
    // 1. SYSTEM: LOADING SCREEN
    // ==========================================================================
    const loader = document.getElementById("loading-screen");
    if (loader) {
        setTimeout(() => {
            loader.style.transition = "opacity 0.5s ease";
            loader.style.opacity = "0";
            setTimeout(() => { loader.style.display = "none"; }, 500);
        }, 1500);
    }

    // ==========================================================================
    // 2. UTILITY: BACK TO TOP BUTTON (เพิ่ม Throttling ลดอาการกระตุกเวลา Scroll)
    // ==========================================================================
    const backToTopBtn = document.querySelector(".back-to-top");
    if (backToTopBtn) {
        let isScrolling = false;
        window.addEventListener("scroll", () => {
            if (!isScrolling) {
                window.requestAnimationFrame(() => {
                    if (window.scrollY > 300) {
                        backToTopBtn.classList.add("show");
                    } else {
                        backToTopBtn.classList.remove("show");
                    }
                    isScrolling = false;
                });
                isScrolling = true;
            }
        }, { passive: true }); // เพิ่ม passive เพื่อเพิ่มความลื่นในการ Scroll

        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // ==========================================================================
    // 3. NAVIGATION: MOBILE MENU TOGGLE
    // ==========================================================================
    const mobileMenuBtn = document.querySelector(".mobile-menu");
    const navList = document.querySelector(".nav-list");

    if (mobileMenuBtn && navList) {
        const toggleIcon = () => {
            const icon = mobileMenuBtn.querySelector("i");
            if (!icon) return;
            icon.classList.toggle("fa-bars");
            icon.classList.toggle("fa-xmark");
        };

        mobileMenuBtn.addEventListener("click", () => {
            navList.classList.toggle("active");
            toggleIcon();
        });

        // ปิดเมนูอัตโนมัติเมื่อคลิกลิงก์เมนู (มือถือ)
        navList.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                if (navList.classList.contains("active")) {
                    navList.classList.remove("active");
                    toggleIcon();
                }
            });
        });
    }

    // ==========================================================================
    // 4. STATISTICS: COUNTER ANIMATION (นับเลขขึ้นตอนเลื่อนมาเห็น)
    // ==========================================================================
    const counters = document.querySelectorAll(".counter");

    if (counters.length) {
        const animateCounter = (el) => {
            const target = parseInt(el.getAttribute("data-target"), 10) || 0;
            const duration = 1500; // ms
            const startTime = performance.now();

            function tick(now) {
                const progress = Math.min((now - startTime) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
                const value = Math.floor(eased * target);
                el.innerText = value.toLocaleString("th-TH");

                if (progress < 1) {
                    requestAnimationFrame(tick);
                } else {
                    el.innerText = target.toLocaleString("th-TH");
                }
            }
            requestAnimationFrame(tick);
        };

        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach((counter) => counterObserver.observe(counter));
    }

    // ==========================================================================
    // 5. SCROLL REVEAL: เลื่อนมาเห็น element ค่อยๆ ปรากฏขึ้น (.reveal -> .reveal.active)
    // ==========================================================================
    const revealEls = document.querySelectorAll(".reveal");

    if (revealEls.length) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealEls.forEach((el) => revealObserver.observe(el));
    }

    // ==========================================================================
    // 6. SIMULATOR: ECO CALCULATOR (Performance Optimized)
    // ==========================================================================
    const inputElec = document.getElementById("input-electricity");
    const inputWaste = document.getElementById("input-waste");
    const inputPM = document.getElementById("input-pm");

    const elecVal = document.getElementById("elec-val");
    const wasteVal = document.getElementById("waste-val");
    const pmVal = document.getElementById("pm-val");

    // ฝั่งการ์ด 4 ใบ (ขวา)
    const carbonCardVal = document.getElementById("carbon-card-val");
    const pmCardVal = document.getElementById("pm-card-val");
    const waterCardVal = document.getElementById("water-card-val");
    const recycleCardVal = document.getElementById("recycle-card-val");

    // เป้าหมายต้นไม้
    const treesResult = document.getElementById("trees-result");

    // รายงานวิศวกรรม
    const envStatus = document.getElementById("env-status");
    const statusBox = document.getElementById("status-box");
    const engineeringText = document.getElementById("engineering-text");

    // ดึง Element Dashboard บน Hero Banner แค่ครั้งเดียวตอนโหลดหน้าเว็บ (ประหยัด RAM)
    const cardCarbon = document.querySelector(".dashboard-item:nth-child(1) strong");
    const cardPM = document.querySelector(".dashboard-item:nth-child(2) strong");
    const cardRecycle = document.querySelector(".dashboard-item:nth-child(4) strong");

    if (inputElec && inputWaste && inputPM) {

        // ใช้ requestAnimationFrame ช่วยคำนวณตาม Frame Rate จอ ป้องกันอาการค้าง/กระตุก
        let ticking = false;

        function renderSimulation() {
            const elec = parseFloat(inputElec.value) || 0;
            const waste = parseFloat(inputWaste.value) || 0;
            const pm = parseFloat(inputPM.value) || 0;

            // 1. อัปเดตตัวเลขข้าง Slider
            if (elecVal) elecVal.innerText = elec;
            if (wasteVal) wasteVal.innerText = waste.toFixed(1);
            if (pmVal) pmVal.innerText = pm;

            // 2. คำนวณค่าต่างๆ
            const carbonEmissionKg = elec * 0.499 + waste * 30 * 0.0015;
            const carbonTon = (carbonEmissionKg / 1000).toFixed(2);
            const targetRecycleMonth = (waste * 30 * 0.3).toFixed(1);
            const treesNeeded = Math.ceil(carbonEmissionKg / 1); 

            // 3. อัปเดตค่าลง DOM
            if (treesResult) treesResult.innerText = `${treesNeeded} ต้น`;
            if (carbonCardVal) carbonCardVal.innerText = `${carbonTon} ตัน`;
            if (pmCardVal) pmCardVal.innerText = `${pm} µg/m³`;
            if (recycleCardVal) recycleCardVal.innerText = `${targetRecycleMonth} กก.`;

            // คำนวณ Water Quality
            if (waterCardVal) {
                if (pm > 100 || waste > 7) {
                    waterCardVal.innerText = "Poor";
                    waterCardVal.style.color = "#ef4444";
                } else if (pm > 50 || waste > 4) {
                    waterCardVal.innerText = "Moderate";
                    waterCardVal.style.color = "#f59e0b";
                } else {
                    waterCardVal.innerText = "Excellent";
                    waterCardVal.style.color = "#10b981";
                }
            }

            // 4. อัปเดต Hero Dashboard
            if (cardCarbon) cardCarbon.innerText = `${carbonTon} ตัน`;
            if (cardPM) cardPM.innerText = `${pm} µg/m³`;
            if (cardRecycle) cardRecycle.innerText = `${targetRecycleMonth} กก.`;

            // 5. ข้อเสนอแนะเชิงวิศวกรรม
            let advice = "";
            if (pm <= 15) {
                if (envStatus) envStatus.innerText = "คุณภาพอากาศดีมาก (Excellent)";
                if (statusBox) {
                    statusBox.style.backgroundColor = "#ecfdf5";
                    statusBox.style.borderColor = "#10b981";
                }
                if (envStatus) envStatus.style.color = "#059669";
                advice = "สภาพแวดล้อมอยู่ในเกณฑ์ดีเยี่ยม! พื้นฐานทางคณิตศาสตร์ช่วยให้เราวิเคราะห์ความสัมพันธ์เชิงเส้นของปริมาณไฟฟ้าและคาร์บอนฟุตพริ้นท์ได้อย่างแม่นยำ...";
            } else if (pm <= 37.5) {
                if (envStatus) envStatus.innerText = "ปานกลาง (Moderate)";
                if (statusBox) {
                    statusBox.style.backgroundColor = "#fffbeb";
                    statusBox.style.borderColor = "#f59e0b";
                }
                if (envStatus) envStatus.style.color = "#d97706";
                advice = "ดัชนีฝุ่นเริ่มมีผลกระทบเล็กน้อย ในทางวิศวกรรมสิ่งแวดล้อม...";
            } else {
                if (envStatus) envStatus.innerText = "เริ่มมีผลกระทบต่อสุขภาพ (Unhealthy)";
                if (statusBox) {
                    statusBox.style.backgroundColor = "#fef2f2";
                    statusBox.style.borderColor = "#ef4444";
                }
                if (envStatus) envStatus.style.color = "#dc2626";
                advice = "วิกฤตฝุ่นละอองหนาแน่นเกินมาตรฐาน! จำเป็นต้องอาศัยกลไกฟิสิกส์...";
            }

            if (engineeringText) engineeringText.innerText = advice;

            // บันทึกค่าล่าสุดไว้ใน localStorage เพื่อให้หน้า Dashboard นำไปแสดงกราฟได้
            try {
                localStorage.setItem("ecovision_elec", elec);
                localStorage.setItem("ecovision_waste", waste);
                localStorage.setItem("ecovision_pm", pm);
                localStorage.setItem("ecovision_carbon_ton", carbonTon);
                localStorage.setItem("ecovision_recycle_target", targetRecycleMonth);
            } catch (e) {
                // ถ้า localStorage ใช้งานไม่ได้ (เช่น โหมด Private) ก็ข้ามไปเฉยๆ
            }

            ticking = false;
        }

        function updateSimulation() {
            if (!ticking) {
                window.requestAnimationFrame(renderSimulation);
                ticking = true;
            }
        }

        // ดักจับเหตุการณ์
        inputElec.addEventListener("input", updateSimulation);
        inputWaste.addEventListener("input", updateSimulation);
        inputPM.addEventListener("input", updateSimulation);

        // คำนวณครั้งแรกเมื่อโหลดหน้า
        updateSimulation();
    }
});