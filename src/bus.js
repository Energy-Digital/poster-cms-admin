import Vue from 'vue'
export const EventBus = new Vue()

export function forceLogout () {
    EventBus.$emit("force-logout", true)
}