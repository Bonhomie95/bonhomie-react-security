export async function detectVPN() {
  try {
    const pc = new RTCPeerConnection({ iceServers: [] });
    pc.createDataChannel('');
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    return new Promise((resolve) => {
      pc.onicecandidate = (e) => {
        if (!e || !e.candidate) return;

        const ip = e.candidate.address || e.candidate.relatedAddress;

        if (!ip) return;

        // Simple heuristics: datacenter IP ranges
        const dcPatterns = ['amazonaws', 'google', 'digitalocean', 'ovh'];
        fetch(`https://ipapi.co/${ip}/json/`)
          .then((res) => res.json())
          .then((data) => {
            const org = (data?.org || '').toLowerCase();
            const suspicious = dcPatterns.some((p) => org.includes(p));
            resolve({ ip, suspicious, org });
          });
      };
    });
  } catch {
    return { ip: null, suspicious: false };
  }
}
