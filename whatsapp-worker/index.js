<<<<<<< HEAD
const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const client = new Client({
    authStrategy: new LocalAuth(),
    webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
    },
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
        ]
    }
});

let isReady = false;
let messageQueue = [];
let isProcessingQueue = false;

// Generate QR Code
client.on('qr', (qr) => {
    console.log('Scan the QR code below to connect WhatsApp:');
    qrcode.generate(qr, { small: true });
});

// Ready Event
client.on('ready', () => {
    console.log('WhatsApp Client is ready!');
    isReady = true;
});

// Disconnected Event
client.on('disconnected', (reason) => {
    console.log('WhatsApp Client was disconnected', reason);
    isReady = false;
    // Attempt to reconnect if needed, LocalAuth usually handles next startup
});

// Auth Failure
client.on('auth_failure', (msg) => {
    console.error('Authentication failure', msg);
});

// Initialize the WhatsApp Client
client.initialize();

const PROCESS_DELAY_MS = 20000; // 20 seconds

// Function to cleanly format and process queue
const processQueue = async () => {
    if (isProcessingQueue) return;
    isProcessingQueue = true;

    while (messageQueue.length > 0) {
        if (!isReady) {
            console.log('WhatsApp client not ready. Pausing queue processing.');
            break;
        }

        const task = messageQueue[0]; // peek
        const { receiverNumber, messageText } = task;

        try {
            console.log(`Verifying number ${receiverNumber}...`);
            const numberId = await client.getNumberId(receiverNumber);

            if (!numberId) {
                console.error(`Number ${receiverNumber} is not registered on WhatsApp. Skipping.`);
                messageQueue.shift();
                continue;
            }

            const chatId = numberId._serialized;

            console.log(`Sending message to ${receiverNumber} (LID: ${chatId})...`);
            await client.sendMessage(chatId, messageText);
            console.log(`Message successfully sent to ${receiverNumber}`);

            // Move item to the end of the queue to rerun it continuously
            const completedTask = messageQueue.shift();
            messageQueue.push(completedTask);

            // Wait for 20 seconds before sending the next message
            if (messageQueue.length > 0) {
                console.log(`Waiting for ${PROCESS_DELAY_MS / 1000} seconds before next message...`);
                await new Promise((resolve) => setTimeout(resolve, PROCESS_DELAY_MS));
            }
        } catch (error) {
            console.error(`Failed to send message to ${receiverNumber}:`, error);
            // On failure, we might retry or drop. Let's shift and optionally push to back, or just drop.
            // For now, dropping and logging error.
            messageQueue.shift();
        }
    }

    isProcessingQueue = false;
};

// Push to queue endpoint
app.post('/send-message', (req, res) => {
    const { receiverNumber, messageText } = req.body;

    if (!receiverNumber || !messageText) {
        return res.status(400).json({ error: 'receiverNumber and messageText are required.' });
    }

    // Basic validation of phone number (digits only, length check can be added)
    const cleanedNumber = receiverNumber.replace(/\D/g, '');
    if (!cleanedNumber) {
        return res.status(400).json({ error: 'Invalid receiverNumber format.' });
    }

    messageQueue.push({ receiverNumber: cleanedNumber, messageText });
    console.log(`Added message to queue for ${cleanedNumber}. Queue size: ${messageQueue.length}`);

    // Start processing if not already
    processQueue();

    return res.status(200).json({ message: 'Message queued successfully', queueSize: messageQueue.length });
});

// Health check endpoint
app.get('/status', (req, res) => {
    res.json({ ready: isReady, queueSize: messageQueue.length });
});

// Clear queue endpoint
app.post('/clear-queue', (req, res) => {
    const previousSize = messageQueue.length;
    messageQueue = [];
    console.log(`Queue cleared. Removed ${previousSize} messages.`);
    return res.status(200).json({ message: 'Queue cleared successfully', previousSize });
});

// Dynamic port assignment with fallback
const initialPort = parseInt(process.env.PORT || '3001', 10);

const startServer = (port) => {
    const server = app.listen(port, () => {
        console.log(`WhatsApp Worker running on port ${port}`);
        // Ensure child processes cleanly exit
        process.env.WHATSAPP_WORKER_URL = `http://localhost:${port}`;
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`Port ${port} is already in use. Attempting to start on port ${port + 1}...`);
            startServer(port + 1);
        } else {
            console.error('An unexpected server error occurred:', err);
        }
    });

    // Graceful Shutdown Handlers to cleanly kill puppeteer/express instances
    const shutdown = async (signal) => {
        console.log(`\nReceived ${signal}. Shutting down worker gracefully...`);
        server.close(async () => {
            console.log('HTTP server closed.');
            try {
                if (isReady) {
                    await client.destroy();
                    console.log('WhatsApp client successfully destroyed.');
                }
            } catch (destroyErr) {
                console.error('Error during WhatsApp client teardown:', destroyErr);
            }
            process.exit(0);
        });

        // Force close if graceful teardown takes longer than 5 seconds
        setTimeout(() => {
            console.error('Forced shutdown due to timeout.');
            process.exit(1);
        }, 5000);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
};

startServer(initialPort);
=======
const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const client = new Client({
    authStrategy: new LocalAuth(),
    webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
    },
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
        ]
    }
});

let isReady = false;
let messageQueue = [];
let isProcessingQueue = false;

// Generate QR Code
client.on('qr', (qr) => {
    console.log('Scan the QR code below to connect WhatsApp:');
    qrcode.generate(qr, { small: true });
});

// Ready Event
client.on('ready', () => {
    console.log('WhatsApp Client is ready!');
    isReady = true;
});

// Disconnected Event
client.on('disconnected', (reason) => {
    console.log('WhatsApp Client was disconnected', reason);
    isReady = false;
    // Attempt to reconnect if needed, LocalAuth usually handles next startup
});

// Auth Failure
client.on('auth_failure', (msg) => {
    console.error('Authentication failure', msg);
});

// Initialize the WhatsApp Client
client.initialize();

const PROCESS_DELAY_MS = 20000; // 20 seconds

// Function to cleanly format and process queue
const processQueue = async () => {
    if (isProcessingQueue) return;
    isProcessingQueue = true;

    while (messageQueue.length > 0) {
        if (!isReady) {
            console.log('WhatsApp client not ready. Pausing queue processing.');
            break;
        }

        const task = messageQueue[0]; // peek
        const { receiverNumber, messageText } = task;

        try {
            console.log(`Verifying number ${receiverNumber}...`);
            const numberId = await client.getNumberId(receiverNumber);

            if (!numberId) {
                console.error(`Number ${receiverNumber} is not registered on WhatsApp. Skipping.`);
                messageQueue.shift();
                continue;
            }

            const chatId = numberId._serialized;

            console.log(`Sending message to ${receiverNumber} (LID: ${chatId})...`);
            await client.sendMessage(chatId, messageText);
            console.log(`Message successfully sent to ${receiverNumber}`);

            // Move item to the end of the queue to rerun it continuously
            const completedTask = messageQueue.shift();
            messageQueue.push(completedTask);

            // Wait for 20 seconds before sending the next message
            if (messageQueue.length > 0) {
                console.log(`Waiting for ${PROCESS_DELAY_MS / 1000} seconds before next message...`);
                await new Promise((resolve) => setTimeout(resolve, PROCESS_DELAY_MS));
            }
        } catch (error) {
            console.error(`Failed to send message to ${receiverNumber}:`, error);
            // On failure, we might retry or drop. Let's shift and optionally push to back, or just drop.
            // For now, dropping and logging error.
            messageQueue.shift();
        }
    }

    isProcessingQueue = false;
};

// Push to queue endpoint
app.post('/send-message', (req, res) => {
    const { receiverNumber, messageText } = req.body;

    if (!receiverNumber || !messageText) {
        return res.status(400).json({ error: 'receiverNumber and messageText are required.' });
    }

    // Basic validation of phone number (digits only, length check can be added)
    const cleanedNumber = receiverNumber.replace(/\D/g, '');
    if (!cleanedNumber) {
        return res.status(400).json({ error: 'Invalid receiverNumber format.' });
    }

    messageQueue.push({ receiverNumber: cleanedNumber, messageText });
    console.log(`Added message to queue for ${cleanedNumber}. Queue size: ${messageQueue.length}`);

    // Start processing if not already
    processQueue();

    return res.status(200).json({ message: 'Message queued successfully', queueSize: messageQueue.length });
});

// Health check endpoint
app.get('/status', (req, res) => {
    res.json({ ready: isReady, queueSize: messageQueue.length });
});

// Clear queue endpoint
app.post('/clear-queue', (req, res) => {
    const previousSize = messageQueue.length;
    messageQueue = [];
    console.log(`Queue cleared. Removed ${previousSize} messages.`);
    return res.status(200).json({ message: 'Queue cleared successfully', previousSize });
});

// Dynamic port assignment with fallback
const initialPort = parseInt(process.env.PORT || '3001', 10);

const startServer = (port) => {
    const server = app.listen(port, () => {
        console.log(`WhatsApp Worker running on port ${port}`);
        // Ensure child processes cleanly exit
        process.env.WHATSAPP_WORKER_URL = `http://localhost:${port}`;
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`Port ${port} is already in use. Attempting to start on port ${port + 1}...`);
            startServer(port + 1);
        } else {
            console.error('An unexpected server error occurred:', err);
        }
    });

    // Graceful Shutdown Handlers to cleanly kill puppeteer/express instances
    const shutdown = async (signal) => {
        console.log(`\nReceived ${signal}. Shutting down worker gracefully...`);
        server.close(async () => {
            console.log('HTTP server closed.');
            try {
                if (isReady) {
                    await client.destroy();
                    console.log('WhatsApp client successfully destroyed.');
                }
            } catch (destroyErr) {
                console.error('Error during WhatsApp client teardown:', destroyErr);
            }
            process.exit(0);
        });

        // Force close if graceful teardown takes longer than 5 seconds
        setTimeout(() => {
            console.error('Forced shutdown due to timeout.');
            process.exit(1);
        }, 5000);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
};

startServer(initialPort);
>>>>>>> 982de5be0005fc50a91e0d60a279260788774a51
