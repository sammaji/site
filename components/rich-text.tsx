import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichText as RichTextWithoutBlocks } from '@payloadcms/richtext-lexical/react'
import { cn } from '@/lib/utils'

/*type NodeTypes =
    | DefaultNodeTypes
    | SerializedBlockNode<CTABlockProps | MediaBlockProps | BannerBlockProps | CodeBlockProps>

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
    ...defaultConverters,
    blocks: {
        banner: ({ node }) => <BannerBlock className="col-start-2 mb-4" {...node.fields} />,
        mediaBlock: ({ node }) => (
            <MediaBlock
                className="col-start-1 col-span-3"
                imgClassName="m-0"
                {...node.fields}
                captionClassName="mx-auto max-w-[48rem]"
                enableGutter={false}
                disableInnerContainer={true}
            />
        ),
        code: ({ node }) => <CodeBlock className="col-start-2" {...node.fields} />,
        cta: ({ node }) => <CallToActionBlock {...node.fields} />,
    },
})*/

type Props = {
    data: SerializedEditorState
    enableGutter?: boolean
    enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText(props: Props) {
    const { className, enableProse = true, enableGutter = true, ...rest } = props
    return (
        <RichTextWithoutBlocks
            className={cn(
                {
                    'container ': enableGutter,
                    'max-w-none': !enableGutter,
                    'mx-auto prose md:prose-md dark:prose-invert ': enableProse,
                },
                className,
            )}
            {...rest}
        />
    )
}
