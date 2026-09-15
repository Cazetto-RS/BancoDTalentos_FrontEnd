import type { JobCategoryKey } from '../../constants/jobCategories'

interface JobCategoryIconProps {
    category: JobCategoryKey
}

const categoryIconPaths: Record<JobCategoryKey, string> = {
    desenvolvimento: 'm8.2 6.2-6 5.8 6 5.8 1.6-1.6L5.5 12l4.3-4.2-1.6-1.6Zm7.6 0-1.6 1.6 4.3 4.2-4.3 4.2 1.6 1.6 6-5.8-6-5.8Z',
    design: 'm15.6 3.4 5 5-9.8 9.8L5 19l.8-5.8 9.8-9.8ZM4 20l6-.8L4.8 14 4 20Zm13-18 5 5-1.4 1.4-5-5L17 2Z',
    mobile: 'M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm0 3v14h8V5H8Zm3 15h2v1h-2v-1Z',
    dados: 'M4 3h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm3 14h2v-5H7v5Zm4 0h2V7h-2v10Zm4 0h2V9h-2v8Z',
    ux: 'M12 2 2 7l10 5 10-5-10-5ZM4 11l8 4 8-4v3l-8 4-8-4v-3Zm0 6 8 4 8-4v3l-8 4-8-4v-3Z',
    devops: 'm19.4 13 .1-1-.1-1 2-1.6-2-3.4-2.5 1a8 8 0 0 0-1.7-1L14.8 2h-4l-.4 2.4a8 8 0 0 0-1.7 1L6.4 4.5 4.4 8l1.9 1.5a8 8 0 0 0 0 2L4.4 13l2 3.5 2.3-.9a8 8 0 0 0 1.7 1l.4 2.4h4l.4-2.4a8 8 0 0 0 1.7-1l2.3.9 2-3.5-1.8-1.5ZM12.8 14a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z',
    qualidade: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1.4 14.6-4.2-4.2 1.8-1.8 2.4 2.4 5.2-5.2 1.8 1.8-7 7Z',
    seguranca: 'm12 2 8 3v6c0 5.1-3.4 9.8-8 11-4.6-1.2-8-5.9-8-11V5l8-3Zm-1.2 14.2 5.8-5.8-1.4-1.4-4.4 4.4-2-2-1.4 1.4 3.4 3.4Z',
    produto: 'M8 2h8l1 3h3a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3l1-3Zm2 3h4l-.4-1h-3.2L10 5Zm-5 5v9h14v-9h-4v2H9v-2H5Z',
}

function JobCategoryIcon({ category }: JobCategoryIconProps) {
    return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" focusable="false" aria-hidden="true">
            <path d={categoryIconPaths[category]} />
        </svg>
    )
}

export default JobCategoryIcon
