const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('ffmpeg-static');

const SRC = path.join(__dirname, '..', 'assents', 'videos-trabalhos');
const OUT = path.join(__dirname, '..', 'assets', 'optimized', 'video');
fs.mkdirSync(OUT, { recursive: true });

const jobs = [
  { file: 'fechadura digital 1.mp4', slug: 'fechadura-digital', poster_t: 1.2 },
  { file: 'motor de portao 2.mp4', slug: 'motor-portao-2', poster_t: 1.5 },
  { file: 'motor de portão.mp4', slug: 'motor-portao-1', poster_t: 1.5 },
];

for (const job of jobs) {
  const input = path.join(SRC, job.file);
  const outMp4 = path.join(OUT, `${job.slug}.mp4`);
  const outPoster = path.join(OUT, `${job.slug}-poster.jpg`);

  console.log('Encoding', job.file, '->', outMp4);
  execFileSync(ffmpeg, [
    '-y', '-i', input,
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '27',
    '-vf', 'scale=480:-2',
    '-c:a', 'aac', '-b:a', '96k',
    '-movflags', '+faststart',
    outMp4,
  ], { stdio: 'inherit' });

  console.log('Poster', job.file, '->', outPoster);
  execFileSync(ffmpeg, [
    '-y', '-ss', String(job.poster_t), '-i', input,
    '-frames:v', '1', '-vf', 'scale=480:-2',
    '-q:v', '3',
    outPoster,
  ], { stdio: 'inherit' });

  const origSize = fs.statSync(input).size;
  const newSize = fs.statSync(outMp4).size;
  console.log(`${job.slug}: ${(origSize / 1024 / 1024).toFixed(2)}MB -> ${(newSize / 1024 / 1024).toFixed(2)}MB`);
}
