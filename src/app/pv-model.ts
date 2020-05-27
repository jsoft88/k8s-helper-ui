export class PvModel {
    private apiVersion?: string;
    private kind?: string;
    private name?: string;
    private type?: string;
    private capacityGbi?: number;
    private storageClassName?: string;
    private accessModes?: string[];
    private hostPath?: string;

    public getApiVersion(): string {
        return this.apiVersion;
    }

    public setApiVersion(apiVersion: string) {
        this.apiVersion = apiVersion;
    }

    public getKind(): string {
        return this.kind;
    }

    public setKind(kind: string) {
        this.kind = kind;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string) {
        this.name = name;
    }

    public getType(): string {
        return this.type;
    }

    public setType(type: string) {
        this.type = type;
    }

    public getCapacityGbi(): number {
        return this.capacityGbi;
    }

    public setCapacityGbi(capacityGbi: number) {
        this.capacityGbi = capacityGbi;
    }

    public getStorageClassName(): string {
        return this.storageClassName;
    }

    public setStorageClassName(storageClassName: string) {
        this.storageClassName = storageClassName;
    }

    public getAccessModes(): string[] {
        return this.accessModes;
    }

    public setAccessModes(accessModes: string[]) {
        this.accessModes = accessModes.slice();
    }

    public getHostPath(): string {
        return this.hostPath;
    }

    public setHostPath(hostPath: string) {
        this.hostPath = hostPath;
    }

    constructor(
        name?: string,
        type?: string,
        capacityGbi?: number,
        accessModes?: string[],
        hostPath?: string) {
            this.apiVersion = 'v1';
            this.kind = 'PersistentVolume';
            this.name = name;
            this.type = type;
            this.capacityGbi = capacityGbi;
            this.accessModes = accessModes ? accessModes.slice() : [];
            this.hostPath = hostPath;
    }
}
