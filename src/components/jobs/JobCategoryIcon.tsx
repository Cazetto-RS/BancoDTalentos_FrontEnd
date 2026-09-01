import type { ReactNode } from 'react'
import type { JobCategoryKey } from '../../constants/jobCategories'

interface JobCategoryIconProps {
    category: JobCategoryKey
}

// Adicione cada SVG aqui. O mesmo ícone será usado no card e no modal.
const categoryIcons: Partial<Record<JobCategoryKey, ReactNode>> = {
    // desenvolvimento: <SeuIcone />,
    // design: <SeuIcone />,
    // mobile: <SeuIcone />,
    // dados: <SeuIcone />,
    // ux: <SeuIcone />,
    // devops: <SeuIcone />,
    // qualidade: <SeuIcone />,
    // seguranca: <SeuIcone />,
    // produto: <SeuIcone />,
}

function JobCategoryIcon({ category }: JobCategoryIconProps) {
    return categoryIcons[category] ?? null
}

export default JobCategoryIcon
