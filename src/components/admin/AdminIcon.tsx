import type { SVGProps } from 'react'

export type AdminIconName =
    | 'arrow-left'
    | 'arrow-right'
    | 'bell'
    | 'briefcase'
    | 'calendar'
    | 'check'
    | 'chevron-down'
    | 'clipboard'
    | 'code'
    | 'copy'
    | 'dashboard'
    | 'data'
    | 'design'
    | 'document'
    | 'edit'
    | 'education'
    | 'external'
    | 'logout'
    | 'mobile'
    | 'money'
    | 'pause'
    | 'plus'
    | 'profile'
    | 'search'
    | 'settings'
    | 'share'
    | 'shield'
    | 'sliders'
    | 'star'
    | 'users'

const paths: Record<AdminIconName, string> = {
    'arrow-left': 'M11 5 4 12l7 7v-4h9V9h-9V5Z',
    'arrow-right': 'm13 5 7 7-7 7v-4H4V9h9V5Z',
    bell: 'M12 22a2.5 2.5 0 0 0 2.35-1.65h-4.7A2.5 2.5 0 0 0 12 22Zm7-6.5-1.7-2.1V9a5.3 5.3 0 0 0-4.2-5.2V3a1.1 1.1 0 0 0-2.2 0v.8A5.3 5.3 0 0 0 6.7 9v4.4L5 15.5V18h14v-2.5Z',
    briefcase: 'M9 4V2h6v2h5a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5Zm2 0h2V3h-2v1Zm-7 7v7h16v-7a21.7 21.7 0 0 1-7 1.2V14h-2v-1.8A21.7 21.7 0 0 1 4 11Zm16-2V6H4v3c2.3.8 4.6 1.2 7 1.3V9h2v1.3c2.4-.1 4.7-.5 7-1.3Z',
    calendar: 'M7 2h2v2h6V2h2v2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2V2Zm12 8H5v10h14V10ZM5 8h14V6H5v2Z',
    check: 'm9.1 16.2-4.3-4.3-2 2 6.3 6.3L21.5 7.8l-2-2L9.1 16.2Z',
    'chevron-down': 'm5.3 8.6 6.7 6.7 6.7-6.7-1.8-1.8-4.9 4.9-4.9-4.9-1.8 1.8Z',
    clipboard: 'M9 2h6a2 2 0 0 1 2 2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2-2Zm0 3h6V4H9v1Zm0 5v2h8v-2H9Zm0 4v2h8v-2H9Z',
    code: 'm8.2 6.2-6 5.8 6 5.8 1.6-1.6L5.5 12l4.3-4.2-1.6-1.6Zm7.6 0-1.6 1.6 4.3 4.2-4.3 4.2 1.6 1.6 6-5.8-6-5.8Z',
    copy: 'M8 2h10a2 2 0 0 1 2 2v12h-2V4H8V2ZM4 6h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Zm0 14h10V8H4v12Z',
    dashboard: 'M3 3h8v8H3V3Zm10 0h8v5h-8V3ZM3 13h8v8H3v-8Zm10-3h8v11h-8V10Z',
    data: 'M4 3h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm3 14h2v-5H7v5Zm4 0h2V7h-2v10Zm4 0h2V9h-2v8Z',
    design: 'm15.6 3.4 5 5-9.8 9.8L5 19l.8-5.8 9.8-9.8ZM4 20l6-.8L4.8 14 4 20Zm13-18 5 5-1.4 1.4-5-5L17 2Z',
    document: 'M6 2h8l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm7 2v5h4l-4-5ZM8 13v2h8v-2H8Zm0 4v2h6v-2H8Z',
    edit: 'm4 16.5-.9 4.4 4.4-.9L19.8 7.7l-3.5-3.5L4 16.5ZM18 2.5 21.5 6 20 7.5 16.5 4 18 2.5Z',
    education: 'm12 3 11 5-11 5L1 8l11-5Zm-7 8.2V16c0 2.2 3.1 4 7 4s7-1.8 7-4v-4.8l-7 3.2-7-3.2ZM21 10v7h2v-8l-2 1Z',
    external: 'M14 3h7v7h-2V6.4l-8.3 8.3-1.4-1.4L17.6 5H14V3ZM5 5h6v2H5v12h12v-6h2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z',
    logout: 'M4 3h8a2 2 0 0 1 2 2v3h-2V5H4v14h8v-3h2v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm13.6 5.2L22.4 13l-4.8 4.8-1.4-1.4 2.4-2.4H9v-2h9.6l-2.4-2.4 1.4-1.4Z',
    mobile: 'M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm0 3v14h8V5H8Zm3 15h2v1h-2v-1Z',
    money: 'M3 5h18v14H3V5Zm2 2v10h14V7H5Zm7 1a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM6 8h2v2H6V8Zm10 6h2v2h-2v-2Z',
    pause: 'M6 4h5v16H6V4Zm7 0h5v16h-5V4Z',
    plus: 'M10 2h4v8h8v4h-8v8h-4v-8H2v-4h8V2Z',
    profile: 'M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5.5 0-10 2.7-10 6v2h20v-2c0-3.3-4.5-6-10-6Z',
    search: 'M10.5 3a7.5 7.5 0 1 0 4.6 13.4l4.7 4.6 1.4-1.4-4.6-4.7A7.5 7.5 0 0 0 10.5 3Zm0 2a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Z',
    settings: 'm19.4 13 .1-1-.1-1 2-1.6-2-3.4-2.5 1a8 8 0 0 0-1.7-1L14.8 2h-4l-.4 2.4a8 8 0 0 0-1.7 1L6.4 4.5 4.4 8l1.9 1.5a8 8 0 0 0 0 2L4.4 13l2 3.5 2.3-.9a8 8 0 0 0 1.7 1l.4 2.4h4l.4-2.4a8 8 0 0 0 1.7-1l2.3.9 2-3.5-1.8-1.5ZM12.8 14a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z',
    share: 'M18 16a3 3 0 0 0-2.4 1.2L8.9 13.7a3 3 0 0 0 0-3.4l6.7-3.5A3 3 0 1 0 15 5l-6.9 3.6a3 3 0 1 0 0 6.8L15 19a3 3 0 1 0 3-3Z',
    shield: 'm12 2 8 3v6c0 5.1-3.4 9.8-8 11-4.6-1.2-8-5.9-8-11V5l8-3Zm-1.2 14.2 5.8-5.8-1.4-1.4-4.4 4.4-2-2-1.4 1.4 3.4 3.4Z',
    sliders: 'M4 5h9v2H4V5Zm13 0h3v2h-3V5Zm-2-2h2v6h-2V3ZM4 11h3v2H4v-2Zm7 0h9v2h-9v-2ZM9 9h2v6H9V9Zm-5 8h11v2H4v-2Zm15 0h1v2h-1v-2Zm-2-2h2v6h-2v-6Z',
    star: 'm12 2.5 3 6.1 6.7 1-4.8 4.7 1.1 6.7-6-3.2L6 21l1.1-6.7-4.8-4.7 6.7-1 3-6.1Z',
    users: 'M9 11a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm8-1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM9 13c-5 0-8 2.5-8 5.5V21h16v-2.5C17 15.5 14 13 9 13Zm8 0c-.8 0-1.5.1-2.2.2 2.5 1.3 4.2 3.1 4.2 5.3V21h4v-2.5c0-3-2.3-5.5-6-5.5Z',
}

interface AdminIconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
    name: AdminIconName
    title?: string
}

function AdminIcon({ name, title, ...props }: AdminIconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden={title ? undefined : true}
            role={title ? 'img' : undefined}
            focusable="false"
            {...props}
        >
            {title && <title>{title}</title>}
            <path d={paths[name]} />
        </svg>
    )
}

export default AdminIcon
