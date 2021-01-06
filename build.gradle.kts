import com.moowork.gradle.node.npm.NpmTask

val ktor_version: String by project
val kotlin_version: String by project
val logback_version: String by project

plugins {
    application
    kotlin("jvm") version "1.4.21"
    id("com.github.node-gradle.node") version "2.2.4"
}

group = "org.choottd"
version = "0.0.1"

application {
    mainClassName = "io.ktor.server.netty.EngineMain"
}

repositories {
    mavenLocal()
    jcenter()
    maven { url = uri("https://kotlin.bintray.com/ktor") }
}

dependencies {
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8:$kotlin_version")
    implementation("io.ktor:ktor-server-netty:$ktor_version")
    implementation("ch.qos.logback:logback-classic:$logback_version")
    implementation("io.ktor:ktor-server-core:$ktor_version")
    implementation("io.ktor:ktor-server-host-common:$ktor_version")
    implementation("io.ktor:ktor-websockets:$ktor_version")
    testImplementation("io.ktor:ktor-server-tests:$ktor_version")
}

kotlin.sourceSets["main"].kotlin.srcDirs("src")
kotlin.sourceSets["test"].kotlin.srcDirs("test")

sourceSets["main"].resources.srcDirs("resources")
sourceSets["test"].resources.srcDirs("testresources")


tasks.register("appNpmInstall", NpmTask::class) {
    description = "Installs all dependencies from package.json"
    setWorkingDir(file("${project.projectDir}/client"))
    setArgs(listOf("install"))
}

tasks.register("appNpmBuild", NpmTask::class) {
    dependsOn(tasks.named("appNpmInstall"))
    description = "Builds production version of the webapp"
    setWorkingDir(file("${project.projectDir}/client"))
    setArgs(listOf("run", "build"))
}

tasks.register("copyWebApp", Copy::class) {
    dependsOn(tasks.named("appNpmBuild"))
    from("client/build")
    into("build/resources/main/static/.")
}

tasks.named("compileJava") {
    dependsOn(tasks.named("copyWebApp"))
}

node {

    version = "14.15.4"
    download = true

    // Set the work directory for unpacking node
    workDir = file("${project.buildDir}/nodejs")

    // Set the work directory for NPM
    npmWorkDir = file("${project.buildDir}/npm")
}
