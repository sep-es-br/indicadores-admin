export interface IBreadcrumbItem {
    label: string;
    link?: string;
    params?: {
        id: string | null;
    };
}