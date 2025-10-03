/**
 * 音频播放管理器
 * 统一管理应用中的音频播放功能
 */

export class AudioManager {
  constructor() {
    this.audioContext = null;
    this.currentPlayingId = null;
    this.isInitialized = false;
  }

  /**
   * 初始化音频上下文
   */
  initialize() {
    if (this.isInitialized) return;

    this.audioContext = uni.createInnerAudioContext();

    // 监听播放结束事件
    this.audioContext.onEnded(() => {
      this.currentPlayingId = null;
      this.onPlayEnd && this.onPlayEnd();
    });

    // 监听播放错误事件
    this.audioContext.onError((err) => {
      console.error('音频播放失败:', err);
      uni.showToast({
        title: '音频播放失败',
        icon: 'none',
      });
      this.currentPlayingId = null;
      this.onPlayError && this.onPlayError(err);
    });

    // 监听播放开始事件
    this.audioContext.onPlay(() => {
      this.onPlayStart && this.onPlayStart();
    });

    this.isInitialized = true;
  }

  /**
   * 播放音频
   * @param {string} audioUrl - 音频URL
   * @param {string|number} audioId - 音频ID
   */
  play(audioUrl, audioId) {
    if (!this.isInitialized) {
      this.initialize();
    }

    if (!audioUrl) {
      uni.showToast({
        title: '暂无语音文件',
        icon: 'none',
      });
      return false;
    }

    if (this.currentPlayingId === audioId) {
      // 如果正在播放同一个文件，则停止播放
      this.stop();
      return false;
    }
    else {
      // 停止当前播放并播放新文件
      this.stop();
      this.audioContext.src = audioUrl;
      this.audioContext.play();
      this.currentPlayingId = audioId;

      uni.showToast({
        title: '开始播放',
        icon: 'none',
      });
      return true;
    }
  }

  /**
   * 停止播放
   */
  stop() {
    if (this.audioContext) {
      this.audioContext.stop();
    }
    this.currentPlayingId = null;
  }

  /**
   * 暂停播放
   */
  pause() {
    if (this.audioContext) {
      this.audioContext.pause();
    }
  }

  /**
   * 继续播放
   */
  resume() {
    if (this.audioContext) {
      this.audioContext.play();
    }
  }

  /**
   * 获取当前播放状态
   */
  isPlaying(audioId) {
    return this.currentPlayingId === audioId;
  }

  /**
   * 获取当前播放的音频ID
   */
  getCurrentPlayingId() {
    return this.currentPlayingId;
  }

  /**
   * 设置播放事件回调
   */
  setCallbacks(callbacks = {}) {
    this.onPlayStart = callbacks.onPlayStart;
    this.onPlayEnd = callbacks.onPlayEnd;
    this.onPlayError = callbacks.onPlayError;
  }

  /**
   * 销毁音频上下文
   */
  destroy() {
    if (this.audioContext) {
      this.audioContext.destroy();
      this.audioContext = null;
    }
    this.currentPlayingId = null;
    this.isInitialized = false;
  }

  /**
   * 设置音频属性
   */
  setAudioProperties(properties = {}) {
    if (!this.audioContext) return;

    // 设置循环播放
    if (properties.loop !== undefined) {
      this.audioContext.loop = properties.loop;
    }

    // 设置音量
    if (properties.volume !== undefined) {
      this.audioContext.volume = properties.volume;
    }

    // 设置播放速率
    if (properties.playbackRate !== undefined) {
      this.audioContext.playbackRate = properties.playbackRate;
    }
  }
}

// 创建单例实例
const audioManager = new AudioManager();

export default audioManager;
