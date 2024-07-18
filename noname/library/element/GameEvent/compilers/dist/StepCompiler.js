// 喵喵！step写法的content全在这里处理喵！
import { _status, ai, game, get, lib, ui } from "../../../../../../noname.js";
import ContentCompilerBase from "./ContentCompilerBase.js";
import ContentCompiler from "./ContentCompiler.js";
import security from "../../../../../util/security.js";
import { CodeSnippet, ErrorManager } from "../../../../../util/error.js";
export default class StepCompiler extends ContentCompilerBase {
    type = "step";
    filter(content) {
        return typeof content === 'function' && content.length === 0;
    }
    compile(content) {
        if (typeof content != "function")
            throw new Error("StepCompiler只能接受函数");
        const compiled = StepCompiler.parseStep(content);
        compiled.type = this.type;
        compiled.original = content;
        return compiled;
    }
    static parseStep(func) {
        if (typeof func !== "function")
            throw new TypeError("为确保安全禁止用parsex/parseStep解析非函数");
        // 虽然现在 parsex 被控制到了沙盒，
        // 但是因为默认沙盒还是可以额外操作东西，
        // 故而对不同的运行域做了区分
        const [, , ModAsyncFunction] = security.getIsolatedsFrom(func);
        //by 诗笺、Tipx-L
        // 沙盒在封装函数时，为了保存源代码会另外存储函数的源代码
        const decompileFunction = security.isSandboxRequired()
            ? security.importSandbox().Marshal.decompileFunction
            : Function.prototype.call.bind(Function.prototype.toString);
        //Remove all comments
        //移除所有注释
        const code = decompileFunction(func)
            .replace(/((?:(?:^[ \t]*)?(?:\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\/(?:[ \t]*\r?\n(?=[ \t]*(?:\r?\n|\/\*|\/\/)))?|\/\/(?:[^\\]|\\(?:\r?\n)?)*?(?:\r?\n(?=[ \t]*(?:\r?\n|\/\*|\/\/))|(?=\r?\n))))+)|("(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|(?:\r?\n|[\s\S])[^/"'\\\s]*)/gm, "$2")
            .trim();
        //获取第一个 { 后的所有字符
        let str = code.slice(code.indexOf("{") + 1).trimEnd();
        // 因为我们丢掉了开头的`{`，现在要去除尾`}`
        str = str.slice(0, str.lastIndexOf("}"));
        //判断代码中是否有debugger
        let regex = /event\.debugger\(\)/;
        let hasDebugger = false;
        let insertDebugger = `await event.debugger()`; // yield code=>eval(code) 唔唔不是我干的喵
        let debuggerSkip = 0;
        let debuggerResult;
        while ((debuggerResult = str.slice(debuggerSkip).match(regex)) != null) {
            if (debuggerResult.index == null)
                throw new Error("匹配到了debugger但是没有索引值");
            let debuggerCopy = str;
            debuggerCopy = debuggerCopy.slice(0, debuggerSkip + debuggerResult.index) + insertDebugger + debuggerCopy.slice(debuggerSkip + debuggerResult.index + debuggerResult[0].length, -1);
            //测试是否有错误
            try {
                new ModAsyncFunction(debuggerCopy);
                str = debuggerCopy + "}";
                debuggerSkip += debuggerResult.index + insertDebugger.length;
                hasDebugger = true;
            }
            catch (error) {
                debuggerSkip += debuggerResult.index + debuggerResult[0].length;
            }
        }
        const contents = [];
        const originals = [];
        const deconstructs = ["step", "source", "target", "targets", "card", "cards", "skill", "forced", "num", "_result: result"];
        const topVars = ["_status", "lib", "game", "ui", "get", "ai"];
        const compileStep = (code, stepHead) => {
            const params = ["topVars", "event", "trigger", "player"];
            const body = `
                var { ${deconstructs.join(", ")} } = event;
                var { ${topVars.join(", ")} } = topVars;
                ${[stepHead, code].filter(Boolean)
                .map(c => `{\n${c}\n}\n`).join("")}
            `;
            return new ModAsyncFunction(...params, body);
        };
        const packStep = (code, stepHead) => {
            const compiled = compileStep(code, stepHead);
            ErrorManager.setCodeSnippet(compiled, new CodeSnippet(code, 3)); // 记录编译后函数的原代码片段
            originals.push(compiled);
            contents.push(function (event, trigger, player) {
                //@ts-ignore
                return compiled.apply(this, [{ _status, ai, game, get, lib, ui }, event, trigger, player]);
            });
        };
        //func中要写步骤的话，必须要写step 0
        if (str.indexOf("step 0") == -1) {
            packStep(str);
        }
        else {
            let skip = 0;
            let step = 0;
            let stepHead = null;
            let result;
            //去除99个step的限制
            while ((result = str.slice(skip).match(new RegExp(`\\(?['"]step ${step}['"]\\)?;?`))) != null) {
                if (result.index == null)
                    throw new Error("匹配到了step但是没有索引值");
                const head = str.slice(0, skip + result.index);
                if (step > 0) {
                    try {
                        packStep(head, stepHead);
                    }
                    catch (e) {
                        skip = result.index + result[0].length;
                        continue;
                    }
                }
                else {
                    stepHead = head.trim();
                    if (stepHead.length == 0)
                        stepHead = null;
                }
                str = str.slice(head.length + result[0].length);
                skip = 0;
                step++;
            }
            packStep(str, stepHead);
        }
        const result = ContentCompiler.compile(contents);
        result.originals = originals;
        return result;
    }
}
