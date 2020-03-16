import Vue from 'vue'
export const EventBus = new Vue()

export function forceLogout () {
    EventBus.$emit("force-logout", true)
}

export function uploadProgress (data) {
    EventBus.$emit("upload-progress", data)
}