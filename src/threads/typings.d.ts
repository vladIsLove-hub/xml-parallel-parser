export interface IThreadSpawner {
    spawn: (pathsToXmls: string[]) => Promise<void>;
}

export interface IXMLWorker {
    
}