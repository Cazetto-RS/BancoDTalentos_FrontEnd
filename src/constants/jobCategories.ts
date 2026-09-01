export const jobCategoryThemes = {
    desenvolvimento: { color: '#169cf9', softColor: '#e6f3fb' },
    design: { color: '#ff2685', softColor: '#ffe5f0' },
    mobile: { color: '#05c9b0', softColor: '#e2faf6' },
    dados: { color: '#ff6b3d', softColor: '#ffebe5' },
    ux: { color: '#9b4dba', softColor: '#f2e8f6' },
    devops: { color: '#f4a20a', softColor: '#fff3dc' },
    qualidade: { color: '#62bf55', softColor: '#eaf7e8' },
    seguranca: { color: '#df5c58', softColor: '#faeae9' },
    produto: { color: '#5a67d8', softColor: '#eaecfb' },
} as const

export type JobCategoryKey = keyof typeof jobCategoryThemes

export function getJobCategoryTheme(category: JobCategoryKey) {
    return jobCategoryThemes[category]
}
