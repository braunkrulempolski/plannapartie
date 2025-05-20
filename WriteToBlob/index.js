const { BlobServiceClient } = require('@azure/storage-blob');
const { v4: uuidv4 } = require('uuid');

module.exports = async function (context, req) {
    context.log('HTTP trigger to write to Azure Blob Storage.');

    const requestBody = req.body || "empty body";
    const fileName = `data-${uuidv4()}.txt`;
    const containerName = 'uploads';

    const connectionString = process.env.AzureWebJobsStorage;

    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Make sure the container exists (optional)
    await containerClient.createIfNotExists();

    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    const uploadBlobResponse = await blockBlobClient.upload(
        JSON.stringify(requestBody),
        Buffer.byteLength(JSON.stringify(requestBody))
    );

    context.res = {
        status: 200,
        body: `Blob saved as: ${fileName}`
    };
};
