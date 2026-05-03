export function parseParamId(param: string | string[] | undefined): number | null {
    if (!param) return null;
    const idString = typeof param === 'string' ? param : param[0];
    const id = parseInt(idString, 10);
    return isNaN(id) ? null : id;
}