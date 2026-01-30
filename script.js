// 全局变量
let videoFile = null;
let audioFile = null;
let combinedVideoURL = null;

// 文件大小限制
const VIDEO_MAX_SIZE = 200 * 1024 * 1024; // 200MB
const AUDIO_MAX_SIZE = 50 * 1024 * 1024;  // 50MB

// DOM元素
const videoUpload = document.getElementById('video-upload');
const audioUpload = document.getElementById('audio-upload');
const videoProgress = document.getElementById('video-progress');
const audioProgress = document.getElementById('audio-progress');
const combineProgress = document.getElementById('combine-progress');
const videoInfo = document.getElementById('video-info');
const audioInfo = document.getElementById('audio-info');
const combineBtn = document.getElementById('combine-btn');
const previewSection = document.querySelector('.preview-section');
const previewVideo = document.getElementById('preview-video');
const downloadBtn = document.getElementById('download-btn');
const statusMessage = document.getElementById('status-message');

// 显示状态消息
function showStatus(message, type = 'info') {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    setTimeout(() => {
        statusMessage.style.display = 'none';
    }, 3000);
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 验证文件
function validateFile(file, maxSize, allowedTypes) {
    console.log('验证文件:', {
        name: file.name,
        size: file.size,
        type: file.type,
        maxSize: maxSize,
        allowedTypes: allowedTypes
    });
    
    // 检查文件大小
    if (file.size > maxSize) {
        const message = `文件大小超过限制，最大允许 ${formatFileSize(maxSize)}`;
        console.log('文件大小验证失败:', message);
        return { valid: false, message: message };
    }
    
    // 检查文件类型
    const fileType = file.type;
    console.log('文件类型:', fileType);
    
    // 更宽松的文件类型检查
    const fileName = file.name.toLowerCase();
    const isAllowedByType = allowedTypes.some(type => fileType.includes(type));
    const isAllowedByExtension = false;
    
    // 基于文件扩展名的检查
    if (!isAllowedByType) {
        if (allowedTypes.includes('video/mp4') && fileName.endsWith('.mp4')) return { valid: true };
        if (allowedTypes.includes('video/avi') && fileName.endsWith('.avi')) return { valid: true };
        if (allowedTypes.includes('video/mov') && fileName.endsWith('.mov')) return { valid: true };
        if (allowedTypes.includes('audio/mp3') && fileName.endsWith('.mp3')) return { valid: true };
        if (allowedTypes.includes('audio/wav') && fileName.endsWith('.wav')) return { valid: true };
        if (allowedTypes.includes('audio/aac') && fileName.endsWith('.aac')) return { valid: true };
    }
    
    if (isAllowedByType) {
        console.log('文件类型验证通过');
        return { valid: true };
    }
    
    const message = '文件格式不支持';
    console.log('文件类型验证失败:', message);
    return { valid: false, message: message };
}

// 处理视频上传
videoUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    console.log('视频文件:', file);
    console.log('视频文件类型:', file.type);
    
    // 验证文件
    const validation = validateFile(file, VIDEO_MAX_SIZE, ['video/mp4', 'video/avi', 'video/mov']);
    if (!validation.valid) {
        showStatus(validation.message, 'error');
        console.log('视频文件验证失败:', validation.message);
        return;
    }
    
    console.log('视频文件验证通过');
    
    // 显示上传进度
    videoProgress.style.display = 'block';
    
    // 模拟上传进度
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        if (progress > 100) {
            clearInterval(interval);
            videoProgress.style.display = 'none';
            videoFile = file;
            videoInfo.textContent = `文件名: ${file.name}, 大小: ${formatFileSize(file.size)}`;
            console.log('视频文件上传完成，videoFile:', videoFile);
            checkFilesReady();
            showStatus('视频文件上传成功', 'success');
        } else {
            videoProgress.querySelector('.progress-bar').style.width = `${progress}%`;
            videoProgress.querySelector('.progress-text').textContent = `${progress}%`;
        }
    }, 200);
});

// 处理音频上传
audioUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    console.log('音频文件:', file);
    console.log('音频文件类型:', file.type);
    
    // 验证文件
    const validation = validateFile(file, AUDIO_MAX_SIZE, ['audio/mp3', 'audio/wav', 'audio/aac']);
    if (!validation.valid) {
        showStatus(validation.message, 'error');
        console.log('音频文件验证失败:', validation.message);
        return;
    }
    
    console.log('音频文件验证通过');
    
    // 显示上传进度
    audioProgress.style.display = 'block';
    
    // 模拟上传进度
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        if (progress > 100) {
            clearInterval(interval);
            audioProgress.style.display = 'none';
            audioFile = file;
            audioInfo.textContent = `文件名: ${file.name}, 大小: ${formatFileSize(file.size)}`;
            console.log('音频文件上传完成，audioFile:', audioFile);
            checkFilesReady();
            showStatus('音频文件上传成功', 'success');
        } else {
            audioProgress.querySelector('.progress-bar').style.width = `${progress}%`;
            audioProgress.querySelector('.progress-text').textContent = `${progress}%`;
        }
    }, 200);
});

// 检查文件是否准备就绪
function checkFilesReady() {
    console.log('检查文件准备状态:', {
        videoFile: !!videoFile,
        audioFile: !!audioFile,
        bothReady: !!(videoFile && audioFile)
    });
    
    if (videoFile && audioFile) {
        combineBtn.disabled = false;
        console.log('合成按钮已启用');
    } else {
        combineBtn.disabled = true;
        console.log('合成按钮已禁用');
    }
}

// 更新合成进度
function updateCombineProgress(progress) {
    combineProgress.style.display = 'block';
    combineProgress.querySelector('.progress-bar').style.width = `${progress}%`;
    combineProgress.querySelector('.progress-text').textContent = `${Math.round(progress)}%`;
}

// 使用浏览器API合成视频
async function combineVideoWithAudio(videoFile, audioFile) {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('开始合成视频');
            updateCombineProgress(0);
            
            // 创建视频元素
            const videoElement = document.createElement('video');
            videoElement.src = URL.createObjectURL(videoFile);
            videoElement.muted = true;
            videoElement.playbackRate = 1.0;
            
            // 创建音频元素
            const audioElement = document.createElement('audio');
            audioElement.src = URL.createObjectURL(audioFile);
            audioElement.playbackRate = 1.0;
            audioElement.muted = true; // 静音播放，只用于捕获音频轨道
            
            console.log('创建媒体元素完成');
            updateCombineProgress(10);
            
            // 等待视频和音频加载完成
            await Promise.all([
                new Promise((resolve, reject) => {
                    videoElement.onloadedmetadata = resolve;
                    videoElement.onerror = reject;
                }),
                new Promise((resolve, reject) => {
                    audioElement.onloadedmetadata = resolve;
                    audioElement.onerror = reject;
                })
            ]);
            
            console.log('媒体元素加载完成');
            console.log('视频信息:', {
                width: videoElement.videoWidth,
                height: videoElement.videoHeight,
                duration: videoElement.duration
            });
            console.log('音频信息:', {
                duration: audioElement.duration
            });
            updateCombineProgress(20);
            
            // 创建Canvas元素
            const canvas = document.createElement('canvas');
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            const ctx = canvas.getContext('2d');
            
            console.log('创建Canvas完成');
            updateCombineProgress(30);
            
            // 创建MediaRecorder
            const stream = canvas.captureStream(30);
            console.log('创建视频流完成');
            updateCombineProgress(40);
            
            // 播放音频以捕获音频轨道（但保持静音）
            try {
                await audioElement.play();
                console.log('音频开始播放（静音）以捕获轨道');
                
                // 捕获音频轨道并添加到流中
                const audioStream = audioElement.captureStream();
                const audioTracks = audioStream.getAudioTracks();
                console.log('音频轨道数量:', audioTracks.length);
                
                if (audioTracks.length > 0) {
                    const audioTrack = audioTracks[0];
                    stream.addTrack(audioTrack);
                    console.log('音频轨道添加成功');
                } else {
                    console.log('没有找到音频轨道');
                }
            } catch (error) {
                console.error('音频播放失败:', error);
                // 音频播放失败不阻止合成
            }
            
            // 配置MediaRecorder
            let recorder;
            let mimeType = 'video/webm'; // 使用更兼容的格式
            
            // 检查可用的MIME类型
            if (MediaRecorder.isTypeSupported('video/mp4')) {
                mimeType = 'video/mp4';
            } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
                mimeType = 'video/webm;codecs=vp9';
            } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
                mimeType = 'video/webm;codecs=vp8';
            }
            
            try {
                recorder = new MediaRecorder(stream, {
                    mimeType: mimeType
                });
                console.log('创建MediaRecorder成功，使用格式:', mimeType);
            } catch (error) {
                console.error('创建MediaRecorder失败:', error);
                // 尝试使用默认格式
                recorder = new MediaRecorder(stream);
                console.log('使用默认格式创建MediaRecorder成功');
            }
            updateCombineProgress(50);
            
            const chunks = [];
            recorder.ondataavailable = e => {
                if (e.data.size > 0) {
                    chunks.push(e.data);
                    console.log('获取到数据块，大小:', e.data.size);
                }
            };
            
            recorder.onstop = () => {
                console.log('录制停止，数据块数量:', chunks.length);
                updateCombineProgress(100);
                
                if (chunks.length > 0) {
                    const blob = new Blob(chunks, { type: mimeType });
                    console.log('创建Blob成功，大小:', blob.size);
                    console.log('Blob类型:', blob.type);
                    resolve(blob);
                } else {
                    reject(new Error('没有录制到数据'));
                }
            };
            
            recorder.onerror = (error) => {
                console.error('MediaRecorder错误:', error);
                reject(error);
            };
            
            // 开始录制
            recorder.start(500); // 每500ms获取一次数据
            console.log('开始录制');
            updateCombineProgress(60);
            
            // 播放视频并绘制到Canvas
            try {
                await videoElement.play();
                console.log('视频开始播放');
            } catch (error) {
                console.error('视频播放失败:', error);
                reject(error);
                return;
            }
            
            let frameCount = 0;
            const totalFrames = Math.ceil(videoElement.duration * 30);
            
            function drawFrame() {
                if (videoElement.paused || videoElement.ended) {
                    console.log('视频播放结束或暂停');
                    recorder.stop();
                    return;
                }
                
                ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
                frameCount++;
                
                // 更新进度
                const currentProgress = 60 + (frameCount / totalFrames) * 40;
                updateCombineProgress(currentProgress);
                
                if (frameCount % 30 === 0) { // 每30帧打印一次
                    console.log('绘制帧:', frameCount);
                }
                
                requestAnimationFrame(drawFrame);
            }
            
            drawFrame();
            
        } catch (error) {
            console.error('合成过程错误:', error);
            updateCombineProgress(0);
            combineProgress.style.display = 'none';
            reject(error);
        }
    });
}

// 合成视频
combineBtn.addEventListener('click', async () => {
    if (!videoFile || !audioFile) {
        showStatus('请先上传视频和音频文件', 'error');
        return;
    }
    
    console.log('点击合成按钮');
    showStatus('正在合成视频，请稍候...', 'info');
    combineBtn.disabled = true;
    
    try {
        console.log('开始合成视频');
        // 使用浏览器API合成视频
        const combinedBlob = await combineVideoWithAudio(videoFile, audioFile);
        
        console.log('合成完成，创建Blob URL');
        
        // 隐藏合成进度条
        setTimeout(() => {
            combineProgress.style.display = 'none';
        }, 1000);
        
        // 创建Blob URL
        combinedVideoURL = URL.createObjectURL(combinedBlob);
        
        console.log('显示预览区域');
        // 显示预览
        previewVideo.src = combinedVideoURL;
        previewSection.style.display = 'block';
        downloadBtn.disabled = false;
        
        console.log('合成成功，启用下载按钮');
        showStatus('视频合成成功', 'success');
    } catch (error) {
        console.error('合成失败:', error);
        showStatus('视频合成失败，请重试', 'error');
        // 隐藏合成进度条
        combineProgress.style.display = 'none';
        // 显示错误详情
        const errorMessage = document.createElement('div');
        errorMessage.style.color = 'red';
        errorMessage.style.marginTop = '10px';
        errorMessage.textContent = `错误详情: ${error.message}`;
        document.querySelector('.upload-section').appendChild(errorMessage);
        setTimeout(() => {
            errorMessage.remove();
        }, 5000);
    } finally {
        combineBtn.disabled = false;
        console.log('合成过程结束，恢复按钮状态');
    }
});

// 下载视频
downloadBtn.addEventListener('click', () => {
    if (!combinedVideoURL) {
        showStatus('没有可下载的视频', 'error');
        return;
    }
    
    const a = document.createElement('a');
    a.href = combinedVideoURL;
    a.download = 'combined-video.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    showStatus('视频下载成功', 'success');
});

// 初始化应用
function init() {
    showStatus('应用已准备就绪，可以开始上传文件', 'info');
}

// 启动应用
init();
