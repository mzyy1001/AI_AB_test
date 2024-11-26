# AI_AB_test XV 拾伍

通过万亿参智能体数字人建模市场消费人群群像，精准描画用户行为，实现可解释的、针对性的、图灵完备的AB测试。

## 解决痛点
1. **真人AB测试昂贵**：样本少且代表性有限，难以全面覆盖市场需求。
2. **无法对客户群体进行精准测试**：传统的测试方式无法深入刻画不同消费群体的特征和行为。
3. **测试结果缺乏可解释性**：微调模型或小数量多模型框架的测试意见参考性差且不可解释。
4. **动态建模市场**：利用大数量智能体和智能体链有效动态建模市场中的消费群体，同时可以针对特定消费类型、使用场景或具体人群场景精细建模。

## 亮点
1. **成本低廉**：成本为真人AB测试的约 1/6000 ～ 1/5000，为其他现有AB测试的约 1/1000 ～ 1/800。
2. **主动式动态用户行为建模**：相比传统方式，具有更高的时效性和准确性，能更好地响应市场动态。
3. **可解释性与建设性分析**：提供建设性分析报告，具备可解释性，为业务发展提供切实可行的建议。

## 功能模块
- **用户管理**：支持用户注册、登录、个人资料修改和密码重置。
- **视频或网址上传**：用户可以上传视频或提交网址进行分析。
- **后台处理**：后台管理人员可以手动处理上传内容，并生成分析报告。
- **报告查看**：用户可以查看生成的分析报告，支持 PDF 下载。

## 技术栈
- **前端**：使用 React.js + Material UI，确保用户界面美观且响应迅速。
- **后端**：使用 Node.js + Express.js 搭建 API 服务，支持用户管理、文件上传和数据处理。
- **数据库**：使用 SQL 存储用户信息和上传内容的元数据。
- **部署**：后端部署在 Heroku，前端使用 Netlify 完成部署。

## 使用方法
1. **克隆仓库**：
   ```sh
   git clone https://github.com/mzyy1001/AI_AB_test.git
   ```
2. **依赖版本**
   ```sh
      >node -v
      v22.11.0
   ```
## 贡献
欢迎提交 Issue 和 Pull Request，共同完善项目。


## 计划

#### 1. 用户管理

**目标**：实现用户注册、登录和基本账户管理功能。

1.1 **用户注册与登录**
- 构建网站基本sever/client 框架
- 使用Express.js的 **Passport.js** 或其他身份认证中间件实现JWT认证。
- 实现注册页面和登录页面，使用简单的前端表单提交数据给后端。
- 后端API验证用户数据并生成JWT Token返回前端。

1.2 **账户管理**

- 实现用户个人资料修改功能，包括更新密码、邮箱等基本信息。
- 增加密码重置功能，可以通过邮件发送密码重置链接。


#### 2. 视频或网址上传

**目标**：实现用户上传视频或输入网址的功能，并将这些内容传递到后台等待处理。

2.1 **前端上传组件**

- 使用HTML和JavaScript实现上传页面，可以选择上传视频文件或输入网址。
- 实现上传进度条功能，让用户知道上传状态。

2.2 **后端处理上传**

- 使用 **Multer** 中间件来处理Express.js中的文件上传。
- 设置上传文件的大小限制，并将文件存储在服务器或云存储上（如Amazon S3）。
- 对于网址上传，将用户输入的网址存储到数据库，等待后台人员处理。


#### 3. 后台处理工作流

**目标**：设计一个工作流，让后台人员能够处理用户上传的视频或网址，并生成分析报告。

3.1 **后台管理页面**

- 使用基本的前端页面，允许后台用户查看所有上传内容的列表（包含状态，如未处理、处理中、已完成）。

3.2 **手动处理和报告上传**

- 后台用户可以选择某个上传内容，手动进行分析并生成报告。
- 报告生成后，后台可以通过管理页面将分析报告上传到系统中，标记为完成。


#### 4. 前端界面与用户交互

**目标**：提供用户友好的界面，展示分析报告并支持用户与系统的基本交互。

4.1 **用户报告查看页面**

- 当后台处理完成后，用户能够通过前端页面查看报告。
- 报告可以是PDF文件下载链接或在页面上显示的详细分析结果。

4.2 **前端设计与用户体验**

- 使用 **Bootstrap** 或 **Material UI** 等UI框架设计简洁美观的用户界面。
- 确保界面对移动设备友好，具有响应式布局。（not decided）
- 增加agent的历史记录呈现功能

#### 5. 支付功能


#### 6. 部署与测试

**目标**：确保网站的稳定性和功能完整性，并将网站发布上线。

6.1 **测试**

- 测试每一个功能模块，包括用户管理、文件上传、后台处理、报告查看等，确保没有明显Bug。
- 安排几个测试账号来模拟用户操作，观察可能的问题。

6.2 **部署**

- 使用 **Heroku** 或 **DigitalOcean** 部署后端服务，前端页面可以部署到 **Netlify** 或 **Vercel**。
- 设置基本的SSL证书，确保用户信息传输安全。
