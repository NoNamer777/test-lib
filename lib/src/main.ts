import { FileService } from './lib/services/file/file.service';

async function main() {
    const service = FileService.instance();

    const content = await service.getFile('lib/src/assets/images/black10x10.jpeg');
    console.log(Buffer.from(content).toString('base64'));
}

main();
