import { ThreadSpawner } from './src/threads/Spawner';
import { getPathToXmls } from './src/utils'

async function main() {
    const xmlPaths = await getPathToXmls();
    new ThreadSpawner().spawn(xmlPaths);
}

main();