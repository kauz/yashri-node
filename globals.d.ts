declare interface Window {
    AudioContext: typeof AudioContext;
    webkitAudioContext: typeof AudioContext;
    MediaElementAudioSourceNodes: any;
}

declare interface MediaElementAudioSourceNodes {
    [key: string]: object;
}
