import { forwardRef } from "react";
import PropTypes from "prop-types";

export const PostContent = forwardRef(({ post }, ref) => {
  return (
    <article ref={ref} className="max-w-[820px] w-full text-left">
      {post.content.split("\n\n").map((paragraph, idx) => {
        if (paragraph.startsWith("## ")) {
          return (
            <h2
              key={idx}
              className="text-3xl md:text-4xl font-bold mt-16 mb-6 leading-[1.2] tracking-tight text-left"
            >
              {paragraph.replace("## ", "")}
            </h2>
          );
        }
        if (paragraph.startsWith("### ")) {
          return (
            <h3
              key={idx}
              className="text-2xl md:text-3xl font-bold mt-12 mb-5 leading-[1.3] tracking-tight text-left"
            >
              {paragraph.replace("### ", "")}
            </h3>
          );
        }
        if (paragraph.startsWith("> ")) {
          return (
            <blockquote
              key={idx}
              className="border-l-4 border-primary pl-6 md:pl-8 pr-4 py-4 italic my-8 md:my-10 text-lg md:text-xl leading-relaxed text-muted-foreground bg-muted/30 rounded-r-lg"
            >
              {paragraph.replace("> ", "")}
            </blockquote>
          );
        }
        if (paragraph.startsWith("```")) {
          const code = paragraph.replace(/```\w*/g, "").trim();
          return (
            <pre key={idx} className="bg-muted p-5 md:p-6 rounded-lg overflow-x-auto my-8 md:my-10 border">
              <code className="text-sm">{code}</code>
            </pre>
          );
        }
        if (paragraph.startsWith("- ")) {
          const items = paragraph.split("\n- ").map((i) => i.replace(/^- /, ""));
          return (
            <ul key={idx} className="list-disc pl-6 space-y-3 my-8 text-lg leading-relaxed">
              {items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          );
        }
        if (paragraph.startsWith("| ")) {
          return (
            <div key={idx} className="overflow-x-auto my-6">
              <table className="w-full border-collapse">
                <tbody>
                  {paragraph.split("\n").map((row, i) => (
                    <tr key={i} className="border-b">
                      {row
                        .split("|")
                        .filter((c) => c.trim())
                        .map((cell, j) => (
                          <td key={j} className="p-2 border">
                            {cell.trim()}
                          </td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        if (paragraph.trim().match(/^\d+\. /)) {
          const items = paragraph.split(/\n\d+\. /);
          return (
            <ol key={idx} className="list-decimal pl-6 space-y-3 my-8 text-lg leading-relaxed">
              {items.map((item, i) => (
                <li key={i}>{item.replace(/^\d+\. /, "")}</li>
              ))}
            </ol>
          );
        }
        if (paragraph.startsWith("---")) {
          return <hr key={idx} className="my-8 border-border" />;
        }
        if (paragraph.trim().startsWith("*") && paragraph.trim().endsWith("*")) {
          return (
            <p key={idx} className="text-center italic text-muted-foreground my-6">
              {paragraph.replace(/\*/g, "")}
            </p>
          );
        }
        return (
          <p key={idx} className="my-6 md:my-8 text-lg md:text-xl leading-[1.75] text-foreground/90">
            {paragraph}
          </p>
        );
      })}
    </article>
  );
});

PostContent.displayName = "PostContent";

PostContent.propTypes = {
  post: PropTypes.shape({
    content: PropTypes.string.isRequired,
  }).isRequired,
};

export default PostContent;
