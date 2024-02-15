export function truncateMiddle(input: string, targetLength: number): string {
    if (input.length <= targetLength) {
        return input;
    }

    const start = Math.floor((targetLength - 3) / 2);
    const end = input.length - targetLength + start + 3;

    return input.substring(0, start) + '...' + input.substring(end);
}