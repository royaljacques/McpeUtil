export default async function getServerInfo(serverType: string, ip: string, port: string) {
    const url = `https://api.mcstatus.io/v2/status/${serverType}/${ip}:${port}`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
}