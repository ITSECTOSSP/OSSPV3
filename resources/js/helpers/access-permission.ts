export const canAccessDocumentTracking = (role: number, section?: number) => {
    return role === 1 || role === 2 || role === 3 || section === 5;
};

export const canAccessDeptHead = (role: number) => {
    return role === 1 || role === 2;
};

export const canAccessDivisionMonitoring = (
    role: number,
    section?: number,
) => {
    return role === 1 || role === 3 || section === 5;
};