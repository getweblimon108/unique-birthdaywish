
        // Global variables
        let photos = [];
        let currentPhotoIdx = 0;
        let wishIdx = 0;
        let eaten = 0;
        let typeTimer;
        let musicPlaying = false;
        let ageAnimationInterval;
        
        // Birthday wishes
        const wishes = [
            "May your year be as bright and beautiful as the light you bring to the world.",
            "Wishing you a magnificent celebration filled with unforgettable moments.",
            "To a beautiful soul: may every dream you hold find its way to your heart.",
            "Cheers to another year of grace, wisdom, and boundless happiness.",
            "May your path be paved with gold and your heart always be full.",
            "Wishing you a day of elegance, laughter, and pure joy.",
            "May the stars align to make this your most magical year yet.",
            "You deserve the world—today is just the beginning of the best!"
        ];

        // DOM elements
        const toast = document.getElementById('toast');
        const toastText = document.getElementById('toast-text');
        const musicControl = document.getElementById('music-control');
        const musicIcon = document.getElementById('music-icon');
        const musicText = document.getElementById('music-text');
        const bgMusic = document.getElementById('bg-music');
        const popSound = document.getElementById('pop-sound');
        const candleSound = document.getElementById('candle-sound');
        const confettiSound = document.getElementById('confetti-sound');
        const giftSound = document.getElementById('gift-sound');
        const clickSound = document.getElementById('click-sound');
        const launchBtn = document.getElementById('launch-btn');
        const launchText = document.getElementById('launch-text');
        const launchLoading = document.getElementById('launch-loading');
        const uploadProgressBar = document.getElementById('upload-progress-bar');
        const uploadProgressContainer = document.getElementById('upload-progress-container');
        const profileRing = document.getElementById('profile-ring');

        // Initialize particles
        function initParticles() {
            const particlesContainer = document.getElementById('particles');
            particlesContainer.innerHTML = '';
            
            // Create 50 particles
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                
                // Random properties
                const size = Math.random() * 4 + 1;
                const posX = Math.random() * 100;
                const duration = Math.random() * 20 + 10;
                const delay = Math.random() * 10;
                
                // Apply styles
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.left = `${posX}%`;
                particle.style.animationDuration = `${duration}s`;
                particle.style.animationDelay = `${delay}s`;
                
                // Random color
                const colors = ['#ffffff', '#fdf6ba', '#d4af37', '#b8860b'];
                particle.style.background = colors[Math.floor(Math.random() * colors.length)];
                
                particlesContainer.appendChild(particle);
            }
        }

        // Show toast notification
        function showToast(message, duration = 3000) {
            toastText.textContent = message;
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, duration);
        }

        // Play sound effect
        function playSound(soundElement) {
            try {
                soundElement.currentTime = 0;
                soundElement.play().catch(e => {
                    console.log("Audio play failed:", e);
                });
            } catch (error) {
                console.log("Sound error:", error);
            }
        }

        // Play party popper sound
        function playPopSound() {
            playSound(popSound);
        }

        // Toggle music playback
        function toggleMusic() {
            if (musicPlaying) {
                // Pause music
                bgMusic.pause();
                musicPlaying = false;
                musicIcon.className = 'fas fa-play';
                musicText.textContent = "PLAY MUSIC";
                showToast("Music paused", 1500);
            } else {
                // Play music
                bgMusic.play()
                    .then(() => {
                        musicPlaying = true;
                        musicIcon.className = 'fas fa-pause';
                        musicText.textContent = "PAUSE MUSIC";
                        showToast("Music playing", 1500);
                    })
                    .catch(e => {
                        console.log("Music play failed:", e);
                        showToast("Click to play music", 2000);
                    });
            }
        }

        // Auto-play music on launch with pop sound effect
        function autoPlayMusic() {
            // Play pop sound first (timed with the initial confetti explosion)
            setTimeout(() => {
                playPopSound();
            }, 100); // Small delay to sync with confetti animation
            
            // Then start background music
            setTimeout(() => {
                bgMusic.play()
                    .then(() => {
                        musicPlaying = true;
                        musicIcon.className = 'fas fa-pause';
                        musicText.textContent = "PAUSE MUSIC";
                        
                        showToast("🎵 Birthday music started!", 2000);
                    })
                    .catch(e => {
                        console.log("Auto-play failed:", e);
                        // If auto-play fails, show instruction
                        musicIcon.className = 'fas fa-play';
                        musicText.textContent = "PLAY MUSIC";
                        musicPlaying = false;
                        showToast("Click PLAY MUSIC to start birthday music", 3000);
                    });
            }, 300); // Slight delay after pop sound
        }

        // Photo upload handling
        document.getElementById('fileIn').onchange = (e) => {
            photos = [];
            const files = Array.from(e.target.files).slice(0, 3);
            
            if (files.length === 0) return;
            
            uploadProgressContainer.style.display = 'block';
            uploadProgressBar.style.width = '0%';
            
            let loaded = 0;
            const total = files.length;
            
            files.forEach((file, index) => {
                const reader = new FileReader();
                reader.onloadstart = () => {
                    uploadProgressBar.style.width = `${(index / total) * 100}%`;
                };
                
                reader.onload = (f) => {
                    photos.push(f.target.result);
                    loaded++;
                    uploadProgressBar.style.width = `${(loaded / total) * 100}%`;
                    
                    if (loaded === total) {
                        setTimeout(() => {
                            uploadProgressContainer.style.display = 'none';
                            showToast(`${photos.length} photo(s) uploaded successfully!`, 2000);
                        }, 500);
                        
                        // Display first photo
                        if (photos.length > 0) {
                            document.getElementById('outImg').src = photos[0];
                        }
                    }
                };
                
                reader.onerror = () => {
                    loaded++;
                    showToast(`Error loading photo ${index + 1}`, 2000);
                };
                
                reader.readAsDataURL(file);
            });
        };

        // Rotate photos in album
        function rotatePhotos() {
            if (photos.length < 2) return;
            
            const imgEl = document.getElementById('outImg');
            setInterval(() => {
                imgEl.classList.add('img-fade');
                setTimeout(() => {
                    currentPhotoIdx = (currentPhotoIdx + 1) % photos.length;
                    imgEl.src = photos[currentPhotoIdx];
                    imgEl.classList.remove('img-fade');
                    
                    // Add ring rotation animation when changing photos
                    profileRing.classList.add('rotating');
                    setTimeout(() => {
                        profileRing.classList.remove('rotating');
                    }, 2000);
                }, 800);
            }, 5000);
        }

        // Launch the experience
        function launch() {
            const name = document.getElementById('inName').value.trim();
            const age = document.getElementById('inAge').value.trim();
            
            if (!name) {
                showToast("Please enter a name", 2000);
                document.getElementById('inName').focus();
                return;
            }
            
            if (!age || age < 1 || age > 120) {
                showToast("Please enter a valid age (1-120)", 2000);
                document.getElementById('inAge').focus();
                return;
            }
            
            if (photos.length === 0) {
                showToast("Please upload at least one photo", 2000);
                return;
            }
            
            // Show loading state
            launchText.classList.add('hide');
            launchLoading.classList.remove('hide');
            launchBtn.disabled = true;
            
            // Simulate loading with progress
            setTimeout(() => {
                document.getElementById('setup-ui').classList.add('hide');
                document.getElementById('celebration-ui').classList.remove('hide');
                
                document.getElementById('outName').textContent = name;
                animateAge(parseInt(age));
                typeWish();
                rotatePhotos();
                
                // Start background animations
                initParticles();
                
                // Auto-play birthday music with pop sound effect
                autoPlayMusic();
                
                // Confetti celebration with perfect timing
                setTimeout(() => {
                    confetti({
                        particleCount: 250,
                        spread: 120,
                        origin: { y: 0.6 },
                        colors: ['#d4af37', '#ffffff', '#fdf6ba', '#b8860b', '#ff7b00']
                    });
                    
                    // Additional side confetti
                    setTimeout(() => {
                        confetti({
                            particleCount: 100,
                            angle: 60,
                            spread: 80,
                            origin: { x: 0, y: 0.5 },
                            colors: ['#d4af37', '#fdf6ba']
                        });
                        
                        confetti({
                            particleCount: 100,
                            angle: 120,
                            spread: 80,
                            origin: { x: 1, y: 0.5 },
                            colors: ['#b8860b', '#ff7b00']
                        });
                    }, 200);
                    
                    // Play celebration sound
                    playSound(confettiSound);
                }, 100); // Slight delay to sync with pop sound
                
                // Show welcome message
                setTimeout(() => {
                    showToast(`Happy Birthday ${name}! 🎂`, 3000);
                }, 1000);
            }, 1500);
        }

        // Animate age counter
        function animateAge(target) {
            let current = 0;
            const ageElement = document.getElementById('outAge');
            
            if (ageAnimationInterval) {
                clearInterval(ageAnimationInterval);
            }
            
            ageAnimationInterval = setInterval(() => {
                current++;
                ageElement.textContent = current;
                
                // Add animation effect every 5 numbers
                if (current % 5 === 0) {
                    ageElement.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        ageElement.style.transform = 'scale(1)';
                    }, 200);
                }
                
                if (current >= target) {
                    clearInterval(ageAnimationInterval);
                    
                    // Final celebration when age reaches target
                    confetti({
                        particleCount: 100,
                        angle: 60,
                        spread: 80,
                        origin: { x: 0, y: 0.5 }
                    });
                    
                    confetti({
                        particleCount: 100,
                        angle: 120,
                        spread: 80,
                        origin: { x: 1, y: 0.5 }
                    });
                }
            }, 40);
        }

        // Type wish text
        function typeWish() {
            const text = wishes[wishIdx];
            const el = document.getElementById('msg-text');
            el.innerHTML = "";
            let i = 0;
            
            clearInterval(typeTimer);
            
            typeTimer = setInterval(() => {
                if (i < text.length) {
                    el.innerHTML += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typeTimer);
                }
            }, 40);
        }

        // Handle new wish
        function newWish() {
            playSound(clickSound);
            
            const slices = document.querySelectorAll('.cake-slice');
            if (eaten < 8) {
                // Animate slice being eaten
                slices[eaten].classList.add('eaten');
                
                // Add particle effect
                const rect = slices[eaten].getBoundingClientRect();
                confetti({
                    particleCount: 30,
                    spread: 40,
                    origin: {
                        x: (rect.left + rect.width / 2) / window.innerWidth,
                        y: (rect.top + rect.height / 2) / window.innerHeight
                    },
                    colors: ['#d4af37', '#fdf6ba']
                });
                
                eaten++;
                wishIdx = (wishIdx + 1) % wishes.length;
                typeWish();
                
                // Show gift when all slices are eaten
                if (eaten === 8) {
                    setTimeout(() => {
                        document.getElementById('cake-container').style.display = 'none';
                        document.getElementById('gift-box').style.display = 'block';
                        showToast("You've unlocked a special gift! Click to open.", 3000);
                    }, 800);
                }
            }
        }

        // Blow out candle with pop sound effect
        function blowCandle() {
            // Play pop sound effect (timed with candle blow)
            setTimeout(() => {
                playPopSound();
            }, 50); // Small delay to sync with flame animation
            
            // Play candle sound
            playSound(candleSound);
            
            const flame = document.getElementById('flame');
            flame.classList.add('off');
            
            // Candle blow effect with perfect timing
            setTimeout(() => {
                confetti({
                    particleCount: 120,
                    spread: 70,
                    origin: { y: 0.3 },
                    colors: ['#ff7b00', '#ff4500', '#ffcc00', '#ffff00'],
                    scalar: 1.1
                });
                
                // Smoke effect
                setTimeout(() => {
                    for (let i = 0; i < 12; i++) {
                        setTimeout(() => {
                            confetti({
                                particleCount: 4,
                                spread: 35,
                                origin: { y: 0.3 },
                                colors: ['#888888', '#aaaaaa', '#cccccc'],
                                scalar: 0.7,
                                gravity: 0.6
                            });
                        }, i * 80);
                    }
                }, 250);
            }, 100); // Synced with pop sound
            
            showToast("Make a wish! ✨", 2000);
        }

        // Open gift with pop sound effect
        function openGift() {
            // Play pop sound effect (timed with gift opening)
            setTimeout(() => {
                playPopSound();
            }, 150); // Delayed to match gift lid animation
            
            // Play gift sound
            playSound(giftSound);
            
            const giftBox = document.getElementById('gift-box');
            giftBox.classList.add('popped');
            
            // Big confetti explosion with perfect timing
            setTimeout(() => {
                confetti({
                    particleCount: 450,
                    spread: 190,
                    origin: { y: 0.5 },
                    scalar: 1.3,
                    colors: ['#d4af37', '#ffffff', '#fdf6ba', '#b8860b', '#ff7b00', '#ff4500', '#ffff00']
                });
                
                // Additional side explosions
                setTimeout(() => {
                    confetti({
                        particleCount: 180,
                        angle: 60,
                        spread: 90,
                        origin: { x: 0, y: 0.5 },
                        colors: ['#d4af37', '#fdf6ba']
                    });
                    
                    confetti({
                        particleCount: 180,
                        angle: 120,
                        spread: 90,
                        origin: { x: 1, y: 0.5 },
                        colors: ['#b8860b', '#ff7b00']
                    });
                }, 250);
            }, 300); // Synced with pop sound
            
            // Hide gift after animation
            setTimeout(() => {
                giftBox.style.display = 'none';
                showToast("🎁 Surprise! Amazing gift unlocked! 🎁", 3000);
            }, 1200);
        }

        // Export HD image
        function exportHD() {
            playSound(clickSound);
            
            showToast("Creating your birthday memory...", 2000);
            
            const canvas = document.getElementById('export-canvas');
            const ctx = canvas.getContext('2d');
            const img = document.getElementById('outImg');
            const name = document.getElementById('outName').textContent.toUpperCase();
            const age = document.getElementById('outAge').textContent;
            const currentWish = wishes[wishIdx];

            // Background
            ctx.fillStyle = "#050510";
            ctx.fillRect(0, 0, 1080, 1920);
            
            // Add gradient background
            const gradient = ctx.createRadialGradient(540, 960, 0, 540, 960, 1200);
            gradient.addColorStop(0, "rgba(120, 30, 110, 0.2)");
            gradient.addColorStop(1, "rgba(30, 80, 150, 0.2)");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 1080, 1920);
            
            // Glass card effect
            ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
            ctx.beginPath();
            ctx.roundRect(80, 150, 920, 1620, 80);
            ctx.fill();
            
            // Draw profile image
            if (img.src) {
                ctx.save();
                ctx.beginPath();
                ctx.arc(540, 500, 240, 0, Math.PI * 2);
                ctx.clip();
                
                const aspect = img.naturalWidth / img.naturalHeight;
                let dw = 480;
                let dh = 480 / aspect;
                
                // Center the image
                ctx.drawImage(img, 540 - dw / 2, 260, dw, dh);
                ctx.restore();
                
                // Gold border
                ctx.beginPath();
                ctx.arc(540, 500, 240, 0, Math.PI * 2);
                ctx.strokeStyle = "#d4af37";
                ctx.lineWidth = 15;
                ctx.stroke();
            }
            
            // Age display
            ctx.textAlign = "center";
            ctx.fillStyle = "#fdf6ba";
            ctx.font = "bold 300px Cinzel";
            ctx.fillText(age, 540, 1000);
            
            // Add shadow to age
            ctx.strokeStyle = "#050510";
            ctx.lineWidth = 10;
            ctx.strokeText(age, 540, 1000);
            
            // Title
            ctx.font = "bold 80px Cinzel";
            ctx.fillStyle = "#d4af37";
            ctx.fillText("HAPPY BIRTHDAY,", 540, 1200);
            
            // Name
            ctx.fillStyle = "#fff";
            ctx.font = "bold 90px Cinzel";
            ctx.fillText(name, 540, 1320);
            
            // Current wish
            ctx.font = "italic 45px Playfair Display";
            ctx.fillStyle = "#fdf6ba";
            
            const words = currentWish.split(' ');
            let line = '';
            let y = 1500;
            const lineHeight = 70;
            const maxWidth = 900;
            
            for (let i = 0; i < words.length; i++) {
                const testLine = line + words[i] + ' ';
                const metrics = ctx.measureText(testLine);
                
                if (metrics.width > maxWidth && i > 0) {
                    ctx.fillText(line, 540, y);
                    line = words[i] + ' ';
                    y += lineHeight;
                } else {
                    line = testLine;
                }
            }
            
            ctx.fillText(line, 540, y);
            
            // Decorative elements
            ctx.fillStyle = "#d4af37";
            ctx.font = "30px Cinzel";
            ctx.fillText("✦ ETERNAL BIRTHDAY FINALE ✦", 540, 1800);
            
            // Create download link
            const link = document.createElement('a');
            link.download = `Birthday_${name}_${age}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            showToast("Memory downloaded successfully!", 3000);
        }

        // Reset experience
        function resetExperience() {
            playSound(clickSound);
            
            if (confirm("Are you sure you want to reset the celebration? Your current progress will be lost.")) {
                // Stop music first
                bgMusic.pause();
                musicPlaying = false;
                
                // Reset all variables
                photos = [];
                currentPhotoIdx = 0;
                wishIdx = 0;
                eaten = 0;
                
                // Clear intervals
                clearInterval(typeTimer);
                clearInterval(ageAnimationInterval);
                
                // Reset UI
                document.getElementById('celebration-ui').classList.add('hide');
                document.getElementById('setup-ui').classList.remove('hide');
                
                // Reset form fields
                document.getElementById('inName').value = '';
                document.getElementById('inAge').value = '';
                document.getElementById('fileIn').value = '';
                document.getElementById('outImg').src = '';
                
                // Reset cake slices
                const slices = document.querySelectorAll('.cake-slice');
                slices.forEach(slice => {
                    slice.classList.remove('eaten');
                });
                
                // Reset gift
                const giftBox = document.getElementById('gift-box');
                giftBox.classList.remove('popped');
                giftBox.style.display = 'none';
                
                // Reset candle
                document.getElementById('flame').classList.remove('off');
                
                // Show cake container
                document.getElementById('cake-container').style.display = 'block';
                
                // Reset music control
                musicIcon.className = 'fas fa-pause';
                musicText.textContent = "PAUSE MUSIC";
                
                // Reset launch button
                launchText.classList.remove('hide');
                launchLoading.classList.add('hide');
                launchBtn.disabled = false;
                
                showToast("Experience reset. Create a new celebration!", 2000);
            }
        }

        // Share experience
        function shareExperience() {
            playSound(clickSound);
            
            if (navigator.share) {
                navigator.share({
                    title: 'Eternal Birthday Finale',
                    text: 'Check out this beautiful birthday celebration I created!',
                    url: window.location.href
                })
                .then(() => showToast("Thanks for sharing!", 2000))
                .catch(err => console.log('Error sharing:', err));
            } else {
                // Fallback for browsers without Web Share API
                navigator.clipboard.writeText(window.location.href)
                    .then(() => showToast("Link copied to clipboard!", 2000))
                    .catch(err => {
                        console.log('Error copying:', err);
                        showToast("Could not share. Please copy the URL manually.", 2000);
                    });
            }
        }

        // Event listeners
        document.addEventListener('DOMContentLoaded', () => {
            // Initialize particles
            initParticles();
            
            // Set audio volumes
            bgMusic.volume = 0.6;
            popSound.volume = 0.8; // Louder for party popper effect
            candleSound.volume = 0.7;
            confettiSound.volume = 0.7;
            giftSound.volume = 0.7;
            clickSound.volume = 0.5;
            
            // Add click sound to buttons
            document.querySelectorAll('.btn, .music-pill, .candle-box, #gift-box').forEach(btn => {
                btn.addEventListener('click', () => {
                    playSound(clickSound);
                });
            });
            
            // Show welcome message
            setTimeout(() => {
                showToast("Welcome to Eternal Birthday Finale! 🎉", 3000);
            }, 1000);
        });

        // Handle page visibility change (pause audio when tab is not active)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && musicPlaying) {
                bgMusic.pause();
            } else if (!document.hidden && musicPlaying) {
                bgMusic.play().catch(e => console.log("Resume failed:", e));
            }
        });
