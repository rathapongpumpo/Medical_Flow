import fs from 'fs';
import path from 'path';

const dir = 'public/assets/js/infrastructure/repositories';
fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('-repository.js') && file !== 'storage-repository.js') {
        const p = path.join(dir, file);
        let content = fs.readFileSync(p, 'utf8');
        content = content.replace(/import \{ (.+)RepositoryContract \} from '\.\.\/\.\.\/domain\/repositories\/(.+)-contract\.js';/, "import { I$1Repository } from '../../domain/repositories/$2-contract.js';");
        fs.writeFileSync(p, content, 'utf8');
    }
});

const dir2 = 'public/assets/js/domain/repositories';
fs.readdirSync(dir2).forEach(file => {
    if (file.endsWith('-contract.js') && file !== 'repository-contract.js') {
        const p = path.join(dir2, file);
        let content = fs.readFileSync(p, 'utf8');
        content = content.replace(/export class (.+)RepositoryContract extends IRepository/, "export class I$1Repository extends IRepository");
        fs.writeFileSync(p, content, 'utf8');
    }
});
