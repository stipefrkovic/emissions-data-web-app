import { options } from "./server-options.ts";

export default {
    /**
     * Returns the list of usable backend servers
     * @returns {string[]}
     */
    getServerOptions(): string[] {
        return options;
    },

    /**
     * Returns the stored server preference
     * @returns {string}
     */
    getSelectedServer(): string | null {
        return window.localStorage.getItem("server");
    },

    /**
     * Stores the given server preference after checking its validity
     * @param {string} server
     */
    setSelectedServer(server: string) {
        // Invalid option
        if(this.getServerOptions().indexOf(server) === -1)
            throw new Error("Invalid server choice");

        window.localStorage.setItem("server", server);
    }
}
