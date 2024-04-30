import { startServer } from "./server"
import dotenv from 'dotenv'

/**
 * main
 * 
 * The entry point for the application
 * 
 * This function is called when the file is loaded
 */
export const main = async () => {
    // Load environment variables from .env file
    dotenv.config()

    // Start the server
    startServer()
}

// Call the main function
main()
